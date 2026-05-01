import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import BuySellModal from '../components/BuySellModal';
import PortfolioCard from '../components/PortfolioCard';
import SearchBar from '../components/SearchBar';
import StockCard from '../components/StockCard';
import StockDetail from '../components/StockDetail';
import Watchlist from '../components/Watchlist';
import api from '../api/client';
import { useSocket } from '../hooks/useSocket';
import { useMarketData } from '../hooks/useMarketData';
import { safeParseJSON } from '../utils/safeStorage';
import STORAGE_KEYS from '../utils/storageKeys';

const DashboardPage = () => {
  const { socket } = useSocket();
  const { stocks, loading, error, selected, setSelected, stockMap, refetch } = useMarketData(socket);
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState(() =>
    safeParseJSON(localStorage.getItem(STORAGE_KEYS.favorites), [])
  );
  const [portfolio, setPortfolio] = useState({ summary: {}, holdings: [] });
  const [modal, setModal] = useState({ open: false, side: 'BUY' });
  const [placing, setPlacing] = useState(false);

  const fetchPortfolio = useCallback(async () => {
    try {
      const { data } = await api.get('/trading/portfolio');
      setPortfolio(data);
    } catch (e) {
      if (e.response?.status !== 401) toast.error('Portfolio unavailable');
    }
  }, []);

  const fetchFavorites = useCallback(async () => {
    try {
      const { data } = await api.get('/favorites');
      setFavorites(data);
      localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(data));
    } catch {
      // Keep local fallback when user is unauthenticated.
    }
  }, []);

  useEffect(() => {
    fetchPortfolio();
    fetchFavorites();
  }, [fetchPortfolio, fetchFavorites]);

  useEffect(() => {
    socket.on('order:created', () => fetchPortfolio());
    return () => socket.off('order:created');
  }, [socket, fetchPortfolio]);

  const filteredStocks = useMemo(
    () => stocks.filter((s) => `${s.symbol} ${s.name}`.toLowerCase().includes(search.toLowerCase())),
    [stocks, search]
  );

  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);

  const toggleFavorite = async (symbol) => {
    const exists = favoriteSet.has(symbol);
    const next = exists ? favorites.filter((x) => x !== symbol) : [...favorites, symbol];
    setFavorites(next);
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(next));

    try {
      if (exists) {
        await api.delete(`/favorites/${symbol}`);
        toast.success(`${symbol} removed from favorites`);
      } else {
        await api.post('/favorites', { symbol });
        toast.success(`${symbol} added to favorites`);
      }
    } catch {
      // local persistence still works even if API call fails
    }
  };

  const placeOrder = async (quantity) => {
    if (!selected) return;
    try {
      setPlacing(true);
      await api.post('/trading/orders', {
        symbol: selected.symbol,
        side: modal.side,
        quantity,
        requestId: crypto.randomUUID(),
      });
      toast.success(`${modal.side} order executed`);
      setModal({ open: false, side: 'BUY' });
      fetchPortfolio();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Order failed');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-slate-100">Stock Dashboard</h1>
        <button onClick={refetch} className="rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-200 hover:border-cyan-400">Refresh</button>
      </div>

      <PortfolioCard summary={portfolio.summary || {}} />

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          <SearchBar value={search} onChange={setSearch} />
          {loading && <p className="text-sm text-slate-400">Loading market...</p>}
          {error && <p className="text-sm text-rose-400">{error}</p>}
          {!loading && !filteredStocks.length && <p className="text-sm text-slate-400">No stocks found.</p>}

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filteredStocks.map((stock) => (
              <StockCard
                key={stock.symbol}
                stock={stock}
                active={selected?.symbol === stock.symbol}
                onSelect={setSelected}
                onFavorite={toggleFavorite}
                favorite={favoriteSet.has(stock.symbol)}
                flash={stock.changePercent >= 0 ? 'hover:shadow-[0_0_30px_rgba(16,185,129,0.12)]' : 'hover:shadow-[0_0_30px_rgba(244,63,94,0.12)]'}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <StockDetail stock={selected} onTrade={(side) => setModal({ open: true, side })} />
          <Watchlist favorites={favorites} stockMap={stockMap} />

          <div className="rounded-xl border border-slate-700 bg-slate-950 p-5">
            <h3 className="mb-3 text-lg font-semibold text-slate-100">Holdings</h3>
            {!portfolio.holdings?.length ? (
              <p className="text-sm text-slate-400">No holdings yet. Start with a buy order.</p>
            ) : (
              <div className="space-y-2">
                {portfolio.holdings.map((h) => (
                  <div key={h._id} className="rounded-lg border border-slate-700 p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-100">{h.symbol}</span>
                      <span className={h.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}>{h.pnl >= 0 ? '+' : ''}${h.pnl.toFixed(2)}</span>
                    </div>
                    <p className="text-slate-400">Qty: {h.quantity} | Avg: ${h.averageBuyPrice.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <BuySellModal
        stock={selected}
        side={modal.side}
        open={modal.open}
        onClose={() => setModal({ open: false, side: 'BUY' })}
        onSubmit={placeOrder}
        loading={placing}
      />
    </main>
  );
};

export default DashboardPage;
