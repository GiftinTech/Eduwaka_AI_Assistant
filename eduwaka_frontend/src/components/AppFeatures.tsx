import React, { useState, useEffect } from 'react';
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
import Button from './ui/button';
import { Link } from 'react-router-dom';

const Features = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const features = [
    {
      icon: Search,
      title: 'Institution Search',
      description: 'Find top universities and colleges across Nigeria.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: BookOpen,
      title: 'Course Search',
      description: 'Discover courses, their requirements, and duration.',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      icon: CheckCircle,
      title: 'AI Eligibility Checker',
      description:
        'Check your eligibility for specific courses and institutions.',
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
      <div className="group relative flex-shrink-0 rounded-2xl border border-gray-200/20 bg-white/60 p-6 text-center shadow-sm backdrop-blur-md hover:shadow-xl dark:border-gray-700/40 dark:bg-gray-800/50">
        {/* subtle gradient highlight on hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-200/20 to-purple-200/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-blue-900/10 dark:to-purple-900/10" />

        <div
          className={`relative z-10 h-14 w-14 rounded-2xl ${feature.bgColor} mx-auto mb-5 flex items-center justify-center`}
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
            className="!rounded-full px-8 py-4 shadow-lg"
          >
            <Link to="/signup" className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Start Your Journey Today
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Features;
