import React from 'react';
import type { SensorReading } from '../types';

export default function StatusCards({ latest }: { latest?: SensorReading }) {
  if (!latest) return <div className="p-4 bg-white rounded shadow">Loading latest reading...</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card title="pH" value={latest.pH} unit="pH" />
      <Card title="TDS" value={latest.tds} unit="ppm" />
      <Card title="Turbidity" value={latest.turbidity} unit="NTU" />
      <Card title="Battery" value={latest.battery_voltage} unit="V" />
      <Card title="Flow" value={latest.flow_rate} unit="L/min" />
      <Card title="Solar" value={latest.solar_percent} unit="%" />
      <Card title="Timestamp" value={new Date(latest.ts).toLocaleTimeString()} unit="" />
    </div>
  );
}

function Card({ title, value, unit }: { title: string; value: any; unit: string; }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="text-2xl font-semibold">{value} <span className="text-sm text-slate-400">{unit}</span></div>
    </div>
  );
}
