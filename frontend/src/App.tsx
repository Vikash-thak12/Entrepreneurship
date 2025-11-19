// src/App.tsx
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import ControlPanel from './components/ControlPanel';
import StatusCards from './components/StatusCards';
import LiveCharts from './components/LiveCharts';
import AlertsPanel from './components/AlertsPanel';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

export type SensorReading = {
  ts: string;
  pH: number;
  tds: number;
  turbidity: number;
  flow_rate: number;
  battery_voltage: number;
  solar_percent: number;
};
export type Alert = { type: string; msg: string };

function App() {
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    // fetch initial history
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/history?limit=200`)
      .then(res => setReadings(res.data.data || []))
      .catch(err => console.error('history fetch error', err));

    const s = io(SOCKET_URL, { transports: ['websocket'] });
    setSocket(s);

    s.on('reading', (payload: { reading: SensorReading }) => {
      setReadings(prev => {
        const next = [...prev.slice(-199), payload.reading];
        return next;
      });
    });

    s.on('alerts', (payload: { alerts: Alert[] }) => {
      setAlerts(prev => [...payload.alerts, ...prev].slice(0, 50));
    });

    s.on('history', (payload: { data: SensorReading[] }) => {
      setReadings(payload.data || []);
    });

    s.on('connect', () => console.log('socket connected', s.id));
    s.on('disconnect', () => console.log('socket disconnected'));

    return () => {
      s.disconnect();
      setSocket(null);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <header className="max-w-7xl mx-auto mb-6">
        <h1 className="text-3xl font-semibold">Solar IoT Water Purifier — Prototype Dashboard</h1>
        <p className="text-sm text-slate-600">Realtime simulated sensor data and alerts</p>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="col-span-2 space-y-4">
          <StatusCards latest={readings[readings.length - 1]} />
          <LiveCharts readings={readings} />
        </section>

        <aside className="space-y-4">
          <ControlPanel socket={socket} />
          <AlertsPanel alerts={alerts} />
        </aside>
      </main>
    </div>
  );
}

export default App;
