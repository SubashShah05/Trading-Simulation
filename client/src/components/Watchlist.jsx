const Watchlist = ({ favorites, stockMap }) => (
  <div className="rounded-xl border border-slate-700 bg-slate-950 p-5">
    <h3 className="mb-3 text-lg font-semibold text-slate-100">Watchlist</h3>
    {!favorites.length ? (
      <p className="text-sm text-slate-400">No favorites selected yet.</p>
    ) : (
      <div className="space-y-2">
        {favorites.map((symbol) => {
          const stock = stockMap[symbol];
          if (!stock) return null;
          return (
            <div key={symbol} className="flex items-center justify-between rounded-lg border border-slate-700 px-3 py-2 text-sm">
              <span className="font-semibold text-slate-200">{symbol}</span>
              <span className={stock.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}>${stock.price.toFixed(2)}</span>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

export default Watchlist;
