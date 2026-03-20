import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  BookOpen,
  CheckCircle,
  GraduationCap,
  HelpCircle,
  Bot,
  Info,
  Users,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const features = [
  {
    icon: Search,
    link: '/dashboard/searchinstitutions',
    title: 'Institution Search',
    description: 'Find top universities and colleges across Nigeria.',
    accent: '#4853ea',
  },
  {
    icon: BookOpen,
    link: '/dashboard/searchcourse',
    title: 'Course Search',
    description: 'Discover courses, their requirements, and duration.',
    accent: '#eb4799',
  },
  {
    icon: CheckCircle,
    link: '/dashboard/eligibilitycheckerai',
    title: 'AI Eligibility Checker',
    description:
      'Check your eligibility for specific courses and institutions.',
    accent: '#eb4799',
  },
  {
    icon: GraduationCap,
    link: '/dashboard/jambCombination',
    title: 'JAMB Subject Checker',
    description: 'Verify the correct subjects for your chosen course.',
    accent: '#4853ea',
  },
  {
    icon: BookOpen,
    link: '/dashboard/olevelCombination',
    title: "O'Level Checker",
    description: "Check O'Level subject requirements instantly.",
    accent: '#4853ea',
  },
  {
    icon: Info,
    link: '/dashboard/institutionOverview',
    title: 'Institution Overview',
    description: 'Detailed university profiles and information.',
    accent: '#eb4799',
  },
  {
    icon: HelpCircle,
    link: '/dashboard/supportHelpDesk',
    title: 'Support Desk',
    description: '24/7 admission guidance and support.',
    accent: '#4853ea',
  },
  {
    icon: Bot,
    link: '/dashboard/chatbot',
    title: 'AI Chatbot',
    description: 'Instant AI-powered answers to your admission questions.',
    accent: '#eb4799',
  },
];

type Feature = (typeof features)[number];

const useInView = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
};

const FeatureCard: React.FC<{ feature: Feature; index: number }> = ({
  feature,
  index,
}) => {
  const { ref, visible } = useInView();
  const Icon = feature.icon;

  const navigate = useNavigate();

  return (
    <div
      ref={ref}
      className="group relative flex cursor-pointer flex-col items-start overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-md"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.5s ease ${index * 80}ms, transform 0.5s ease ${index * 80}ms, box-shadow 0.2s ease`,
      }}
      onClick={() => navigate(`${feature.link}`)}
    >
      {/* Subtle hover tint */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `${feature.accent}06` }}
      />

      {/* Icon */}
      <div
        className="relative z-10 mb-4 flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
        style={{ background: `${feature.accent}14`, color: feature.accent }}
      >
        <Icon size={18} />
      </div>

      {/* Text */}
      <h3 className="relative z-10 mb-1.5 text-sm font-bold text-[#111827]">
        {feature.title}
      </h3>
      <p className="relative z-10 text-xs leading-relaxed text-[#6b7280]">
        {feature.description}
      </p>

      {/* Bottom accent line on hover */}
      <div
        className="absolute bottom-0 left-0 h-0.5 w-0 rounded-full transition-all duration-300 group-hover:w-full"
        style={{ background: feature.accent }}
      />
    </div>
  );
};

const Features = () => {
  const { ref: headerRef, visible: headerVisible } = useInView(0.2);
  const { ref: ctaRef, visible: ctaVisible } = useInView(0.2);

  return (
    <section
      id="features"
      className="relative overflow-hidden bg-[#f3f4f6] py-24"
    >
      {/* Subtle background pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(#00252e 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="container relative z-10 mx-auto px-6 sm:px-8">
        {/* Header */}
        <div
          ref={headerRef}
          className="mb-12 text-center"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          {/* Eyebrow */}
          <span className="mb-4 inline-block rounded-full bg-[#eb4799]/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#eb4799]">
            Platform Features
          </span>
          <h2 className="mx-auto mb-4 w-full max-w-md text-4xl font-extrabold tracking-tight text-[#111827]">
            Everything You Need for{' '}
            <span className="text-[#eb4799]">University Admission</span>
          </h2>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-[#6b7280]">
            Our all-in-one platform gives you the right tools to make informed
            decisions about your educational journey.
          </p>
        </div>

        {/* Grid */}
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>

        {/* CTA */}
        <div
          ref={ctaRef}
          className="mt-16 text-center"
          style={{
            opacity: ctaVisible ? 1 : 0,
            transform: ctaVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s',
          }}
        >
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 rounded-full bg-[#00252e] px-8 py-4 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#003a47] hover:shadow-xl active:scale-[0.98]"
          >
            <Users size={18} />
            Start Your Journey Today
          </Link>
          <p className="mt-3 text-xs text-[#9ca3af]">
            Free to get started · No payment required
          </p>
        </div>
      </div>
    </section>
  );
};

export default Features;
