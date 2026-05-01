import { Star } from 'lucide-react';

const StockCard = ({ stock, active, onSelect, onFavorite, favorite, flash }) => {
  const positive = stock.changePercent >= 0;

  return (
    <button
      onClick={() => onSelect(stock)}
      className={`w-full rounded-xl border p-4 text-left transition hover:-translate-y-0.5 ${active ? 'border-cyan-400 bg-slate-900' : 'border-slate-700 bg-slate-950'} ${flash}`}
    >
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-100">{stock.symbol}</h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavorite(stock.symbol);
          }}
          className={`rounded-full p-1.5 ${favorite ? 'text-yellow-300' : 'text-slate-500 hover:text-yellow-300'}`}
        >
          <Star size={16} fill={favorite ? 'currentColor' : 'none'} />
        </button>
      </div>
      <p className="text-sm text-slate-400">{stock.name}</p>
      <p className="mt-3 text-xl font-bold text-slate-100">${stock.price.toFixed(2)}</p>
      <p className={`text-sm font-medium ${positive ? 'text-emerald-400' : 'text-rose-400'}`}>
        {positive ? '?' : '?'} {Math.abs(stock.changePercent).toFixed(2)}%
      </p>
    </button>
  );
};

export default StockCard;
