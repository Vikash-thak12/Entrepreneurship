import React from 'react';

export default function AlertsPanel({ alerts }: { alerts: { type: string; msg: string }[] }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-medium mb-2">Alerts</h3>
      {alerts.length === 0 && <div className="text-sm text-slate-500">No alerts</div>}
      <ul className="space-y-2 max-h-64 overflow-auto">
        {alerts.map((a, i) => (
          <li key={i} className="p-2 border-l-4 border-red-400 bg-red-50 rounded">
            <div className="text-sm font-semibold">{a.type}</div>
            <div className="text-sm text-slate-700">{a.msg}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
