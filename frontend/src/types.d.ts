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
