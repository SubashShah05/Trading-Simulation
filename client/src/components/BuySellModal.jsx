import { useState } from 'react';

const BuySellModal = ({ stock, side, open, onClose, onSubmit, loading }) => {
  const [quantity, setQuantity] = useState(1);
  if (!open || !stock) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-5">
        <h3 className="text-lg font-semibold text-slate-100">{side} {stock.symbol}</h3>
        <p className="mt-1 text-sm text-slate-400">Locked price: ${stock.price.toFixed(2)}</p>
        <label className="mt-4 block text-sm text-slate-300">Quantity</label>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
        />
        <div className="mt-5 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-200 hover:border-slate-400">Cancel</button>
          <button
            onClick={() => onSubmit(quantity)}
            disabled={loading}
            className={`rounded-lg px-4 py-2 text-sm font-semibold text-slate-950 ${side === 'BUY' ? 'bg-emerald-500 hover:bg-emerald-400' : 'bg-rose-500 hover:bg-rose-400'}`}
          >
            {loading ? 'Processing...' : `Confirm ${side}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuySellModal;
