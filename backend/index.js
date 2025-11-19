const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const PORT = process.env.PORT || 4000;

// In-memory store for demo
let history = []; // store last N readings
const MAX_HISTORY = 1000;

let pumpOn = true; // initially ON

// thresholds for generating alerts
const THRESHOLDS = {
  pH: { min: 6.5, max: 8.5 },
  tds: { max: 500 },        // ppm
  turbidity: { max: 5 },    // NTU
  battery: { min: 11.0 }    // volts
};

// helper: current timestamp
const now = () => new Date().toISOString();

// function that simulates sensor reading
function simulateReading() {
  // base normal ranges
  const pH = +(6.8 + (Math.random() - 0.5) * 0.6).toFixed(2);          // 6.5-8.0
  const tds = Math.round(100 + Math.random() * 200 + (Math.random()<0.05?400:0)); // sometimes spike
  const turbidity = +(1 + Math.random() * 2 + (Math.random()<0.03?10:0)).toFixed(2);
  const flow_rate = +(1.0 + Math.random() * 2.5).toFixed(2); // L/min
  const battery_voltage = +(12.5 - Math.random() * 1.8 - (Math.random()<0.05?1.8:0)).toFixed(2);
  // solar_power percent (simulated)
  const solar_percent = Math.max(0, Math.round(100 * (Math.sin(Date.now()/60000) * 0.5 + 0.5) + (Math.random()-0.5)*10));

  const reading = {
    ts: now(),
    pH,
    tds,
    turbidity,
    flow_rate,
    battery_voltage,
    solar_percent
  };

  // store history
  history.push(reading);
  if (history.length > MAX_HISTORY) history.shift();

  // check alerts
  const alerts = [];
  if (pH < THRESHOLDS.pH.min || pH > THRESHOLDS.pH.max) alerts.push({ type: 'pH', msg: `pH out of range: ${pH}` });
  if (tds > THRESHOLDS.tds.max) alerts.push({ type: 'TDS', msg: `High TDS: ${tds} ppm` });
  if (turbidity > THRESHOLDS.turbidity.max) alerts.push({ type: 'Turbidity', msg: `High turbidity: ${turbidity} NTU` });
  if (battery_voltage < THRESHOLDS.battery.min) alerts.push({ type: 'Battery', msg: `Low battery: ${battery_voltage} V` });

  return { reading, alerts };
}

setInterval(() => {
  if (!pumpOn) return; // stop sending readings when pump is OFF
  const { reading, alerts } = simulateReading();
  io.emit('reading', { reading });
  if (alerts.length) io.emit('alerts', { alerts, ts: now() });
}, 2000);


// REST endpoints
app.get('/api/health', (req, res) => res.json({ status: 'ok', ts: now() }));

app.get('/api/history', (req, res) => {
  // optional query params: limit
  const limit = Math.min(5000, parseInt(req.query.limit || '200', 10));
  const data = history.slice(-limit);
  res.json({ count: data.length, data });
});


app.post('/api/control/pump', (req, res) => {
  const { action } = req.body;
  console.log('Backend: Received control action ->', action, 'from', req.ip);
  // maintain a pump state (optional but helpful)
  pumpOn = (action === 'on'); 
  const status = { pump: pumpOn ? 'ON' : 'OFF', ts: now() };
  console.log('Backend: Emitting control status ->', status);
  io.emit('control', { status });
  res.json({ ok: true, status });
});

// start socket.io connection
io.on('connection', (socket) => {
  console.log('client connected', socket.id);
  // send recent history on connect
  socket.emit('history', { data: history.slice(-200) });

  socket.on('disconnect', () => {
    console.log('client disconnected', socket.id);
  });

  socket.on('requestSnapshot', () => {
    socket.emit('snapshot', { reading: history[history.length - 1] });
  });
});

server.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
