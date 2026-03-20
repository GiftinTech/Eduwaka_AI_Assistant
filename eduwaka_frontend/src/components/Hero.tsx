import { Search, CheckCircle, Sparkles } from 'lucide-react';
import heroIllustration from '../assets/illustration-grow-together.svg';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useCount = (target: number, delay: number) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      let current = 0;
      const increment = target / 80;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCount(target);
          clearInterval(timer);
        } else setCount(Math.floor(current));
      }, 20);
      return () => clearInterval(timer);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, delay]);
  return count;
};

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  const universities = useCount(500, 800);
  const courses = useCount(1000, 950);

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  const anim = (delay = 0) =>
    `transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}` +
    ` delay-[${delay}ms]`;

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white pt-16">
      {/* Dot-grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(#00252e 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* Glow blobs */}
      <div className="bg-[#eb4799]/8 pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] rounded-full blur-[120px]" />
      <div className="bg-[#4853ea]/8 pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full blur-[100px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* ── Left: Copy ── */}
          <div className="text-center lg:text-left">
            {/* Eyebrow pill */}
            <div
              className={`mb-6 ${anim(0)}`}
              style={{ transitionDelay: '0ms' }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-[#e5e7eb] bg-[#f3f4f6] px-4 py-2 text-xs font-semibold text-[#374151]">
                AI-Powered University Admission Guide
              </span>
            </div>

            {/* Headline */}
            <h1
              className={`mb-6 text-5xl font-extrabold leading-[1.1] tracking-tight text-[#111827] md:text-6xl lg:text-6xl ${anim(100)}`}
              style={{ transitionDelay: '100ms' }}
            >
              Simplify Your
              <span className="mt-1 block">
                <span className="text-[#eb4799]">University</span>{' '}
                <span className="text-[#00252e]">Journey</span>
              </span>
            </h1>

            {/* Subheading */}
            <p
              className={`mb-10 max-w-lg text-base leading-relaxed text-[#6b7280] lg:text-lg ${anim(200)}`}
              style={{ transitionDelay: '200ms' }}
            >
              EduWaka helps Nigerian students navigate university admissions
              with intelligent tools for institution search, course eligibility,
              fee estimation, and exam preparation.
            </p>

            {/* CTAs */}
            <div
              className={`mb-12 flex flex-col items-center gap-3 sm:flex-row lg:justify-start ${anim(300)}`}
              style={{ transitionDelay: '300ms' }}
            >
              <button
                onClick={() => navigate('/dashboard/searchInstitutions')}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00252e] px-7 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#003a47] hover:shadow-lg active:scale-[0.98] sm:w-auto"
              >
                <Search size={17} />
                Explore Universities
              </button>
              <button
                onClick={() => navigate('/dashboard/eligibilityCheckerAI')}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#eb4799] px-7 py-3.5 text-sm font-bold text-[#eb4799] transition-all hover:-translate-y-0.5 hover:bg-[#eb4799] hover:text-white hover:shadow-lg active:scale-[0.98] sm:w-auto"
              >
                <CheckCircle size={17} />
                Check Eligibility
              </button>
            </div>

            {/* Stats */}
            <div
              className={`flex items-center justify-center gap-8 lg:justify-start ${anim(400)}`}
              style={{ transitionDelay: '400ms' }}
            >
              {[
                { value: `${universities}+`, label: 'Universities' },
                { value: `${courses}+`, label: 'Courses' },
                { value: 'AI', label: 'Powered' },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center lg:items-start"
                >
                  <span className="text-2xl font-extrabold text-[#111827]">
                    {stat.value}
                  </span>
                  <span className="text-xs text-[#9ca3af]">{stat.label}</span>
                  {i < 2 && <div className="absolute" />}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Illustration ── */}
          <div
            className={`relative transition-all duration-1000 ease-out ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}
            style={{ transitionDelay: '200ms' }}
          >
            {/* Card frame */}
            <div className="relative">
              {/* Decorative rings */}
              <div className="absolute -inset-4" />
              <div className="absolute -inset-8" />

              {/* Main image card */}
              <div className="relative z-10 overflow-hidden">
                <img
                  src={heroIllustration}
                  alt="Nigerian students navigating university admissions"
                  className="h-full w-full transform object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
              </div>

              {/* Floating badge — top left */}
              <div className="absolute -left-5 -top-4 z-20 flex items-center gap-2 rounded-xl border border-[#e5e7eb] bg-white px-4 py-2.5 shadow-lg">
                <Sparkles size={14} className="text-[#eb4799]" />
                <span className="text-xs font-bold text-[#111827]">
                  AI-Powered
                </span>
              </div>

              {/* Floating badge — bottom right */}
              <div className="absolute -bottom-4 -right-5 z-20 flex items-center gap-2 rounded-xl border border-[#e5e7eb] bg-white px-4 py-2.5 shadow-lg">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00252e] text-[10px] font-bold text-white">
                  ✓
                </span>
                <span className="text-xs font-bold text-[#111827]">
                  500+ Institutions
                </span>
              </div>

              {/* Indigo accent block */}
              <div className="bg-[#4853ea]/8 absolute -bottom-3 -left-3 -z-10 h-full w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
