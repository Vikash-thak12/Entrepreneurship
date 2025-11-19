import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import type { SensorReading } from '../types';

export default function LiveCharts({ readings }: { readings: SensorReading[] }) {
  const formatted = readings.map(r => ({
    ts: new Date(r.ts).toLocaleTimeString(),
    pH: r.pH,
    tds: r.tds,
    turbidity: r.turbidity,
    battery: r.battery_voltage,
    solar: r.solar_percent
  }));

  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-lg font-medium mb-3">Live Sensor Charts</h2>
      <div className="space-y-6">
        <div style={{ height: 220 }}>
          <ResponsiveContainer>
            <LineChart data={formatted}>
              <XAxis dataKey="ts" hide />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="pH" stroke="#1f8ef1" dot={false} />
              <Line type="monotone" dataKey="tds" stroke="#10b981" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ height: 180 }}>
          <ResponsiveContainer>
            <LineChart data={formatted}>
              <XAxis dataKey="ts" hide />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="turbidity" stroke="#f97316" dot={false} />
              <Line type="monotone" dataKey="battery" stroke="#ef4444" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ height: 120 }}>
          <ResponsiveContainer>
            <AreaChart data={formatted}>
              <XAxis dataKey="ts" hide />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="solar" stroke="#a78bfa" fill="#a78bfa33" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
