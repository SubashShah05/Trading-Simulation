import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../api/client';

export const useMarketData = (socket) => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);

  const fetchStocks = useCallback(async () => {
    try {
      setError('');
      const { data } = await api.get('/stocks');
      setStocks(data);
      if (!selected && data.length) setSelected(data[0]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load market data');
    } finally {
      setLoading(false);
    }
  }, [selected]);

  useEffect(() => {
    fetchStocks();
    const interval = setInterval(fetchStocks, 20000);
    return () => clearInterval(interval);
  }, [fetchStocks]);

  useEffect(() => {
    if (!socket) return;
    const onUpdate = (incoming) => {
      setStocks(incoming);
      if (selected) {
        const next = incoming.find((s) => s.symbol === selected.symbol);
        if (next) setSelected(next);
      }
    };

    socket.on('stocks:update', onUpdate);
    return () => socket.off('stocks:update', onUpdate);
  }, [socket, selected]);

  const stockMap = useMemo(
    () => stocks.reduce((acc, s) => ({ ...acc, [s.symbol]: s }), {}),
    [stocks]
  );

  return { stocks, loading, error, selected, setSelected, stockMap, refetch: fetchStocks };
};
