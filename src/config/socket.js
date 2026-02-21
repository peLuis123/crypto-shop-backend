import { Server } from 'socket.io';

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:5173', process.env.FRONTEND_URL],
      credentials: true,
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] User connected: ${socket.id}`);

    socket.on('join-user', (userId) => {
      socket.join(`user:${userId}`);
      console.log(`[Socket] User ${userId} joined room user:${userId}`);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] User disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

export const emitTransactionConfirmed = (userId, orderId, txHash) => {
  const io = getIO();
  io.to(`user:${userId}`).emit('transaction:confirmed', {
    orderId,
    txHash,
    message: 'Your purchase has been confirmed. You can now place new orders.',
    timestamp: new Date()
  });
};
