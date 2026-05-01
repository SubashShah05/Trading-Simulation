const { Server } = require('socket.io');

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    socket.on('join:user', (userId) => {
      if (userId) socket.join(userId);
    });
  });

  return io;
};

module.exports = { initSocket };
