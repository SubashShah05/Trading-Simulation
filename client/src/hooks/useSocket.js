import { io } from 'socket.io-client';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useSocket = () => {
  const { user } = useAuth();
  const [connected, setConnected] = useState(false);

  const socket = useMemo(
    () =>
      io(SOCKET_URL, {
        autoConnect: false,
      }),
    []
  );

  useEffect(() => {
    socket.connect();
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    if (user?.id) socket.emit('join:user', user.id);
  }, [socket, user?.id]);

  return { socket, connected };
};
