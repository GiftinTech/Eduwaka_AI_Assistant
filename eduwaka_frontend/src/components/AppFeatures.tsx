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
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      icon: BookOpen,
      title: 'Course Search',
      description: 'Explore thousands of courses',
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
    },
    {
      icon: DollarSign,
      title: 'Fee Checker',
      description: 'Get accurate tuition estimates',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      icon: CheckCircle,
      title: 'Eligibility Checker',
      description: 'Check course qualification',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      icon: GraduationCap,
      title: 'JAMB Subject Checker',
      description: 'Verify required subjects',
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
    },
    {
      icon: BookOpen,
      title: "O'Level Checker",
      description: "Check O'Level requirements",
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      icon: Info,
      title: 'Institution Overview',
      description: 'University information',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      icon: Calendar,
      title: 'Admission Calendar',
      description: 'Important dates & deadlines',
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
    },
    {
      icon: Bell,
      title: 'Email Notifications',
      description: 'Get admission updates',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      icon: HelpCircle,
      title: 'Support Desk',
      description: '24/7 admission support',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      icon: Bot,
      title: 'AI Chatbot',
      description: 'Instant AI-powered answers',
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
    },
    {
      icon: MessageSquare,
      title: 'FAQ Section',
      description: 'Common admission questions',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
  ];

  const firstRowFeatures = features.slice(0, 4);
  const secondRowFeatures = features.slice(4, 8);
  const thirdRowFeatures = features.slice(8, 12);

  type Feature = {
    icon: React.ElementType;
    title: string;
    description: string;
    color: string;
    bgColor: string;
  };

  const FeatureCard: React.FC<{ feature: Feature; index: number }> = ({
    feature,
    index,
  }) => {
    console.log(index);
    const IconComponent = feature.icon;
    return (
      <div className="group mx-4 w-80 flex-shrink-0 transform rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
        <div
          className={`h-12 w-12 rounded-xl ${feature.bgColor} mb-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
        >
          <IconComponent className={`h-6 w-6 ${feature.color}`} />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
          {feature.title}
        </h3>
        <p className="text-base text-gray-700 dark:text-gray-300">
          {feature.description}
        </p>
      </div>
    );
  };

  return (
    <section
      id="features"
      className="bg-muted/30 font-inter relative overflow-hidden py-20 dark:bg-gray-800"
    >
      {/* Curved top edge - facing downwards */}
      <div className="absolute left-0 top-0 w-full overflow-hidden">
        <svg
          className="relative block h-20 w-full bg-[hsl(192,100%,9%)] fill-[hsl(192,100%,9%)] text-white dark:text-gray-900"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path d="M0,0 C300,80 900,80 1200,0 L1200,120 L0,120 Z"></path>
        </svg>
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground dark:text-gray-100 md:text-4xl">
            Everything You Need for University Admission
          </h2>
          <p className="text-muted-foreground mx-auto max-w-3xl text-xl dark:text-gray-300">
            Our comprehensive platform provides all the tools and information
            you need to make informed decisions about your educational future.
          </p>
        </div>

        <div
          className={`space-y-8 transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* First Row - Right to Left */}
          <div className="relative">
            <div className="flex animate-[scroll-right_20s_linear_infinite] hover:[animation-play-state:paused]">
              {[...firstRowFeatures, ...firstRowFeatures].map(
                (feature, index) => (
                  <FeatureCard
                    key={`row1-${index}`}
                    feature={feature}
                    index={index}
                  />
                ),
              )}
            </div>
          </div>

          {/* Second Row - Left to Right */}
          <div className="relative">
            <div className="flex animate-[scroll-left_20s_linear_infinite] hover:[animation-play-state:paused]">
              {[...secondRowFeatures, ...secondRowFeatures].map(
                (feature, index) => (
                  <FeatureCard
                    key={`row2-${index}`}
                    feature={feature}
                    index={index}
                  />
                ),
              )}
            </div>
          </div>

          {/* Third Row - Right to Left */}
          <div className="relative">
            <div className="flex animate-[scroll-right_20s_linear_infinite] hover:[animation-play-state:paused]">
              {[...thirdRowFeatures, ...thirdRowFeatures].map(
                (feature, index) => (
                  <FeatureCard
                    key={`row3-${index}`}
                    feature={feature}
                    index={index}
                  />
                ),
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Button variant="hero" size="lg" className="px-8 py-4">
            <Users className="mr-2 h-5 w-5" />
            Start Your Journey Today
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Features;
