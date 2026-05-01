import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import SkillsSection from '../components/SkillsSection';

const LandingPage = () => {
  return (
    <main className="bg-slate-950 text-slate-100">
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <section id="dashboard" className="mx-auto max-w-6xl px-4 pb-20 md:px-6">
        <a href="/dashboard" className="inline-block rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-200 hover:border-cyan-400 hover:text-cyan-300">Go to Live Dashboard</a>
      </section>
    </main>
  );
};

export default LandingPage;
