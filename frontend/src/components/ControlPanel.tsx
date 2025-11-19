// src/components/ControlPanel.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ControlPanel({ socket }: { socket: any }) {
    const [pump, setPump] = useState<'ON' | 'OFF' | 'ON'>('ON');
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000';

    // send control request
    //   const sendPump = async (action: 'on' | 'off') => {
    //     try {
    //       const res = await axios.post(`${apiBase}/api/control/pump`, { action });
    //       const pumpState = res.data?.status?.pump ?? (action === 'on' ? 'ON' : 'OFF');
    //       setPump(pumpState);
    //       console.log('POST /api/control/pump response:', res.data);
    //     } catch (err) {
    //       console.error('sendPump error', err);
    //     }
    //   };

    const sendPump = async (action: 'on' | 'off') => {
        console.log('sendPump called with action ->', action);
        try {
            const res = await axios.post(`${apiBase}/api/control/pump`, { action });
            console.log('POST /api/control/pump response:', res.data);
            const pumpState = res.data?.status?.pump ?? (action === 'on' ? 'ON' : 'OFF');
            setPump(pumpState);
        } catch (err) {
            console.error('sendPump error', err);
        }
    };

    // attach socket listener when socket becomes available
    useEffect(() => {
        if (!socket) {
            console.log('ControlPanel: socket not ready yet');
            return;
        }
        console.log('ControlPanel: attaching socket listener', socket.id);

        const handler = (payload: any) => {
            if (payload?.status?.pump) {
                setPump(payload.status.pump);
                console.log('Control event received:', payload.status);
            }
        };

        socket.on('control', handler);

        // Optionally request latest snapshot/status from server once connected
        // socket.emit('requestSnapshot');

        return () => {
            socket.off && socket.off('control', handler);
            console.log('ControlPanel: detached socket listener');
        };
    }, [socket]);

    return (
        <div className="bg-white p-4 rounded shadow">
            <h3 className="font-medium mb-2">Controls</h3>
            <div className="flex gap-3">
                <button
                    onClick={() => sendPump('on')}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                    Turn Pump ON
                </button>
                <button
                    onClick={() => sendPump('off')}
                    className="px-4 py-2 bg-slate-200 rounded"
                >
                    Turn Pump OFF
                </button>
            </div>
            <div className="mt-3 text-sm text-slate-600">
                Pump status:&nbsp;
                <span className={`font-semibold ${pump === 'ON' ? 'text-green-600' : pump === 'OFF' ? 'text-red-600' : 'text-gray-600'}`}>
                    {pump}
                </span>
            </div>
        </div>
    );
}
