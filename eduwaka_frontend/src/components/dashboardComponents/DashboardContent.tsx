import { type JSX } from 'react';

import { BookOpen, Bot, ListChecks, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: JSX.Element;
  onClick?: () => void;
}

// DashboardCard component
// DashboardCard component
const DashboardCard = ({
  title,
  description,
  icon,
  onClick,
}: DashboardCardProps) => (
  <button
    onClick={onClick}
    className="flex w-full transform flex-col items-center rounded-lg bg-white p-6 text-center shadow-md transition-shadow duration-300 hover:-translate-y-1 hover:shadow-xl"
  >
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
      {icon}
    </div>
    <h4 className="mb-2 text-xl font-semibold text-gray-900">{title}</h4>
    <p className="text-sm text-gray-600">{description}</p>
  </button>
);
const DashboardContent = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold text-gray-900">
        Welcome to Edu
        <span className="text-pink-600 dark:text-pink-400">Waka!</span>
      </h2>
      <p className="mb-8 text-lg text-gray-700">
        Your AI powered guide to university admissions in Nigeria.
      </p>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Quick Search"
          description="Find institutions and courses quickly."
          icon={<Search size={24} />}
          onClick={() => navigate('searchInstitutions/')}
        />
        <DashboardCard
          title="Eligibility Check"
          description="See if you meet course requirements with AI."
          icon={<ListChecks size={24} />}
          onClick={() => navigate('eligibilityCheckerAI/')}
        />
        <DashboardCard
          title="Exam Prep"
          description="Tools to help you prepare for CBT exams."
          icon={<BookOpen size={24} />}
        />
        <DashboardCard
          title="Chat EduwakaBot"
          description="Ask Eduwaka assistant anything about your admission journey."
          icon={<Bot size={24} />}
          onClick={() => navigate('chatbot/')}
        />
      </div>
      <div className="mt-8">
        <h3 className="mb-4 text-xl font-semibold text-gray-900">
          What's New?
        </h3>
        <ul className="list-inside list-disc space-y-2 text-gray-700">
          <li>New institutions added to our database!</li>
          <li>Improved JAMB subject combination checker.</li>
          <li>Interactive CBT practice questions coming soon!</li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardContent;
