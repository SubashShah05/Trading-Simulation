const PortfolioCard = ({ summary }) => (
  <div className="grid gap-4 rounded-xl border border-slate-700 bg-slate-950 p-5 sm:grid-cols-2 lg:grid-cols-4">
    <div><p className="text-xs text-slate-400">Total Balance</p><p className="text-xl font-semibold text-slate-100">${summary.totalBalance?.toFixed(2) || '0.00'}</p></div>
    <div><p className="text-xs text-slate-400">Cash</p><p className="text-xl font-semibold text-slate-100">${summary.cash?.toFixed(2) || '0.00'}</p></div>
    <div><p className="text-xs text-slate-400">Invested</p><p className="text-xl font-semibold text-slate-100">${summary.investedAmount?.toFixed(2) || '0.00'}</p></div>
    <div><p className="text-xs text-slate-400">P/L</p><p className={`text-xl font-semibold ${(summary.profitLoss || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>${summary.profitLoss?.toFixed(2) || '0.00'}</p></div>
  </div>
);

export default PortfolioCard;
