const StockDetail = ({ stock, onTrade }) => {
  if (!stock) return <div className="rounded-xl border border-slate-700 p-6 text-slate-400">Select a stock to view details.</div>;

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950 p-6">
      <h3 className="text-xl font-semibold text-slate-100">{stock.name} ({stock.symbol})</h3>
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <p className="text-slate-400">Price <span className="block text-lg font-bold text-slate-100">${stock.price.toFixed(2)}</span></p>
        <p className="text-slate-400">Volume <span className="block text-lg font-bold text-slate-100">{stock.volume.toLocaleString()}</span></p>
        <p className="text-slate-400">Day High <span className="block text-lg font-bold text-emerald-400">${stock.high.toFixed(2)}</span></p>
        <p className="text-slate-400">Day Low <span className="block text-lg font-bold text-rose-400">${stock.low.toFixed(2)}</span></p>
      </div>
      <div className="mt-5 flex gap-3">
        <button onClick={() => onTrade('BUY')} className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400">Buy</button>
        <button onClick={() => onTrade('SELL')} className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-rose-400">Sell</button>
      </div>
    </div>
  );
};

export default StockDetail;
