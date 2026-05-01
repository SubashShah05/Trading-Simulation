const stack = ['React', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'JWT', 'Vite'];

const SkillsSection = () => (
  <section id="skills" className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6">
    <h2 className="mb-4 text-2xl font-semibold text-slate-100">Skills</h2>
    <div className="flex flex-wrap gap-3">
      {stack.map((item) => (
        <span key={item} className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300 hover:border-cyan-400 hover:text-cyan-300">
          {item}
        </span>
      ))}
    </div>
  </section>
);

export default SkillsSection;
