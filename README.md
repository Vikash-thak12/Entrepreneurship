# Solar-Powered IoT Water Purifier – Software Prototype

This is a software-only prototype that simulates a solar-powered IoT water purifier.  
It includes a Node.js backend that generates sensor data and a React frontend that displays it.

## How to Run on Your Machine

### 1. Clone the project
git clone https://github.com/Vikash-thak12/Entrepreneurship.git
cd Entrepreneurship

### 2. Start the Backend
cd backend
npm install
npm run dev

Backend runs at:
http://localhost:4000

### 3. Setup Frontend
cd ../frontend
npm install

Create a `.env` file inside the frontend folder with:
VITE_API_URL=http://localhost:4000
VITE_SOCKET_URL=http://localhost:4000

### 4. Start the Frontend
npm run dev

Frontend runs at:
http://localhost:5173

Open the frontend link in your browser. You will see:
- Live sensor readings
- Alerts
- Pump ON/OFF control

That’s it.
