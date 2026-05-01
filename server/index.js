require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const connectDB = require('./src/config/db');
const { initSocket } = require('./src/services/socketService');
const { initPriceEngine } = require('./src/services/priceEngine');

const port = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  const server = http.createServer(app);
  const io = initSocket(server);
  app.set('io', io);
  initPriceEngine(io);

  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

start();
