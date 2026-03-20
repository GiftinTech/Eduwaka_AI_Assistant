import { type JSX } from 'react';
import { BookOpen, Bot, ListChecks, Search, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: JSX.Element;
  onClick?: () => void;
  accent: string;
  accentBg: string;
  tag?: string;
  tagColor?: string;
}

const DashboardCard = ({
  title,
  description,
  icon,
  onClick,
  accent,
  accentBg,
  tag,
  tagColor,
}: DashboardCardProps) => (
  <button
    onClick={onClick}
    className="group relative flex flex-col items-start overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-transparent hover:shadow-md"
    style={{ ['--hover-shadow' as string]: `0 4px 24px ${accent}18` }}
  >
    {tag && (
      <span
        className="absolute right-4 top-4 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
        style={{
          background: `${tagColor ?? accent}18`,
          color: tagColor ?? accent,
        }}
      >
        {tag}
      </span>
    )}
    <div
      className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110"
      style={{ background: accentBg, color: accent }}
    >
      {icon}
    </div>
    <h4 className="mb-1 text-sm font-bold text-[#111827]">{title}</h4>
    <p className="mb-4 text-xs leading-relaxed text-[#6b7280]">{description}</p>
    <div
      className="mt-auto flex items-center gap-1 text-xs font-bold"
      style={{ color: accent }}
    >
      Open{' '}
      <ArrowRight
        size={12}
        className="transition-transform group-hover:translate-x-0.5"
      />
    </div>
  </button>
);

const DashboardContent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div>
      {/* Hero banner */}
      <div className="mb-10 overflow-hidden rounded-2xl bg-[#00252e] px-7 py-8 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-[#4a8fa0]">
              {greeting()}, {user?.username ?? 'there'} 👋
            </p>
            <h2 className="text-2xl font-extrabold leading-tight tracking-tight">
              Welcome to Edu<span className="text-[#eb4799]">Waka</span>
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#4a8fa0]">
              Your AI-powered guide to university admissions in Nigeria.
            </p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#9ca3af]">
        Quick Actions
      </p>
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DashboardCard
          title="Search Institutions"
          description="Find universities, polytechnics and colleges across Nigeria."
          icon={<Search size={18} />}
          onClick={() => navigate('searchInstitutions/')}
          accent="#4853ea"
          accentBg="#4853ea12"
        />
        <DashboardCard
          title="Eligibility Checker"
          description="Find out if you qualify for your desired course with AI analysis."
          icon={<ListChecks size={18} />}
          onClick={() => navigate('eligibilityCheckerAI/')}
          accent="#eb4799"
          accentBg="#eb479912"
          tag="AI"
          tagColor="#eb4799"
        />
        <DashboardCard
          title="EduWaka Chatbot"
          description="Ask anything about JAMB, Post-UTME and your admission journey."
          icon={<Bot size={18} />}
          onClick={() => navigate('chatbot/')}
          accent="#eb4799"
          accentBg="#eb479912"
          tag="AI"
          tagColor="#eb4799"
        />
        <DashboardCard
          title="Exam Prep"
          description="CBT practice tools and study resources to boost your score."
          icon={<BookOpen size={18} />}
          accent="#4853ea"
          accentBg="#4853ea12"
          tag="Soon"
          tagColor="#9ca3af"
        />
      </div>

      {/* What's new */}
      <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6">
        <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-[#9ca3af]">
          What's New
        </p>
        <ul className="space-y-3">
          {[
            { dot: '#eb4799', text: 'New institutions added to our database' },
            {
              dot: '#4853ea',
              text: 'Improved JAMB subject combination checker',
            },
            {
              dot: '#9ca3af',
              text: 'Interactive CBT practice questions — coming soon!',
            },
          ].map((item) => (
            <li
              key={item.text}
              className="flex items-center gap-3 text-sm text-[#374151]"
            >
              <span
                className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                style={{ background: item.dot }}
              />
              {item.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardContent;
