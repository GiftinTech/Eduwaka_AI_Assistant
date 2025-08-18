import React, { useState, useEffect } from 'react';
import {
  Search,
  BookOpen,
  DollarSign,
  CheckCircle,
  GraduationCap,
  Calendar,
  Bell,
  HelpCircle,
  Bot,
  MessageSquare,
  Info,
  Users,
} from 'lucide-react';
import Button from './ui/button';

const Features = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const features = [
    {
      icon: Search,
      title: 'Institution Search',
      description: 'Find the perfect university',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: BookOpen,
      title: 'Course Search',
      description: 'Explore thousands of courses',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      icon: DollarSign,
      title: 'Fee Checker',
      description: 'Get accurate tuition estimates',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: CheckCircle,
      title: 'Eligibility Checker',
      description: 'Check course qualification',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      icon: GraduationCap,
      title: 'JAMB Subject Checker',
      description: 'Verify required subjects',
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
    },
    {
      icon: BookOpen,
      title: "O'Level Checker",
      description: "Check O'Level requirements",
      color: 'text-teal-500',
      bgColor: 'bg-teal-500/10',
    },
    {
      icon: Info,
      title: 'Institution Overview',
      description: 'University information',
      color: 'text-rose-500',
      bgColor: 'bg-rose-500/10',
    },
    {
      icon: Calendar,
      title: 'Admission Calendar',
      description: 'Important dates & deadlines',
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
    },
    {
      icon: Bell,
      title: 'Email Notifications',
      description: 'Get admission updates',
      color: 'text-lime-500',
      bgColor: 'bg-lime-500/10',
    },
    {
      icon: HelpCircle,
      title: 'Support Desk',
      description: '24/7 admission support',
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
    {
      icon: Bot,
      title: 'AI Chatbot',
      description: 'Instant AI-powered answers',
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      icon: MessageSquare,
      title: 'FAQ Section',
      description: 'Common admission questions',
      color: 'text-fuchsia-500',
      bgColor: 'bg-fuchsia-500/10',
    },
  ];

  type Feature = {
    icon: React.ElementType;
    title: string;
    description: string;
    color: string;
    bgColor: string;
  };

  const FeatureCard: React.FC<{ feature: Feature }> = ({ feature }) => {
    const IconComponent = feature.icon;
    return (
      <div className="group relative flex-shrink-0 transform rounded-2xl border border-gray-200/20 bg-white/60 p-6 text-center shadow-md backdrop-blur-md transition-all duration-500 hover:-translate-y-3 hover:shadow-xl dark:border-gray-700/40 dark:bg-gray-800/50">
        {/* subtle gradient highlight on hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-200/20 to-purple-200/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-blue-900/10 dark:to-purple-900/10" />

        <div
          className={`relative z-10 h-14 w-14 rounded-2xl ${feature.bgColor} mx-auto mb-5 flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
        >
          <IconComponent className={`h-7 w-7 ${feature.color}`} />
        </div>
        <h3 className="relative z-10 mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {feature.title}
        </h3>
        <p className="relative z-10 text-sm text-gray-600 dark:text-gray-300">
          {feature.description}
        </p>
      </div>
    );
  };

  return (
    <section
      id="features"
      className="relative overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-100 py-24 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900"
    >
      {/* wavy top edge */}
      {/* <div className="absolute left-0 top-0 w-full overflow-hidden">
        <svg
          className="relative block h-20 w-full fill-white dark:fill-gray-900"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path d="M0,0 C300,80 900,80 1200,0 L1200,120 L0,120 Z"></path>
        </svg>
      </div> */}

      <div className="container relative z-10 mx-auto px-6 sm:px-8">
        <div className="mb-10 text-center">
          <h2 className="mb-4 text-4xl font-extrabold text-gray-900 dark:text-white">
            Everything You Need for University Admission
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Our all-in-one platform provides the right tools to help you make
            informed decisions about your educational journey.
          </p>
        </div>

        <div
          className={`mx-auto grid max-w-5xl grid-cols-2 place-content-center gap-6 transition-all duration-1000 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          {features.map((feature, index) => (
            <FeatureCard key={`feature-${index}`} feature={feature} />
          ))}
        </div>

        <div className="mt-20 text-center">
          <Button
            variant="hero"
            size="lg"
            className="rounded-full px-8 py-4 shadow-lg"
          >
            <Users className="mr-2 h-5 w-5" />
            Start Your Journey Today
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Features;
