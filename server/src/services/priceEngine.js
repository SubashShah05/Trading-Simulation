const seed = [
  { symbol: 'AAPL', name: 'Apple', price: 185.5, volume: 34330000 },
  { symbol: 'MSFT', name: 'Microsoft', price: 426.1, volume: 24550000 },
  { symbol: 'GOOGL', name: 'Alphabet', price: 172.9, volume: 19170000 },
  { symbol: 'AMZN', name: 'Amazon', price: 183.8, volume: 28210000 },
  { symbol: 'TSLA', name: 'Tesla', price: 176.4, volume: 52120000 },
  { symbol: 'NVDA', name: 'NVIDIA', price: 932.2, volume: 48300000 },
];

const market = new Map(
  seed.map((s) => [
    s.symbol,
    {
      ...s,
      open: s.price,
      high: s.price,
      low: s.price,
      prevClose: s.price,
      changePercent: 0,
    },
  ])
);

const randomPct = () => (Math.random() * 2 + 1) / 100;

const tickMarket = () => {
  market.forEach((stock, symbol) => {
    const direction = Math.random() > 0.5 ? 1 : -1;
    const delta = stock.price * randomPct() * direction;
    const next = Math.max(1, stock.price + delta);

    stock.price = Number(next.toFixed(2));
    stock.high = Math.max(stock.high, stock.price);
    stock.low = Math.min(stock.low, stock.price);
    stock.volume += Math.floor(Math.random() * 25000);
    stock.changePercent = Number((((stock.price - stock.prevClose) / stock.prevClose) * 100).toFixed(2));

    market.set(symbol, stock);
  });
};

const getMarketSnapshot = () => Array.from(market.values());

const getStockBySymbol = (symbol) => market.get(symbol?.toUpperCase());

const initPriceEngine = (io) => {
  setInterval(() => {
    tickMarket();
    io.emit('stocks:update', getMarketSnapshot());
  }, 10000);
};

module.exports = { initPriceEngine, getMarketSnapshot, getStockBySymbol };
