const Badge = ({ children }) => (
  <span className="rounded-full border border-slate-600 bg-slate-800 px-3 py-1 text-xs text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300">
    {children}
  </span>
);

const HeroSection = () => (
  <section className="animate-in mx-auto flex min-h-[70vh] w-full max-w-6xl flex-col items-start justify-center gap-6 px-4 py-12 md:px-6">
    <p className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300">Real-Time Trading Simulation</p>
    <h1 className="max-w-3xl text-4xl font-bold leading-tight text-slate-100 md:text-6xl">Hi, I am Trader Dev. I build clean, real-time trading products.</h1>
    <p className="max-w-2xl text-slate-400">Full-stack simulation platform for learning markets with live updates, portfolio analytics, and secure auth.</p>
    <a href="#dashboard" className="rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-slate-900 transition hover:translate-y-[-1px] hover:bg-cyan-400">Explore Dashboard</a>
    <div className="flex flex-wrap gap-2 pt-4">
      <Badge>React</Badge><Badge>Tailwind CSS</Badge><Badge>Node + Express</Badge><Badge>MongoDB</Badge><Badge>Socket.io</Badge>
    </div>
  </section>
);

export default HeroSection;
