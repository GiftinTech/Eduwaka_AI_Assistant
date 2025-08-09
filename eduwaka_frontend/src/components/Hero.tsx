import Button from './ui/button';
import { Search, Bot, CheckCircle } from 'lucide-react';
import heroIllustration from '../assets/illustration-grow-together.svg';
import { useEffect, useState } from 'react';

const Hero = () => {
  const [universitiesCount, setUniversitiesCount] = useState(0);
  const [coursesCount, setCoursesCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const animateCount = (target: number, setter: (value: number) => void) => {
      let current = 0;
      const increment = target / 100;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setter(target);
          clearInterval(timer);
        } else {
          setter(Math.floor(current));
        }
      }, 20);
    };

    // Trigger animations after component mounts
    setTimeout(() => setIsLoaded(true), 100);
    setTimeout(() => animateCount(500, setUniversitiesCount), 800);
    setTimeout(() => animateCount(1000, setCoursesCount), 900);
  }, []);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
      {/* Background Pattern - adjusted for a white background */}
      <div className="absolute inset-0 opacity-10">
        {/* Removed bg-gradient-to-br, replaced with a subtle solid background */}
        <div className="absolute inset-0 bg-gray-50 dark:bg-gray-800"></div>
        <div className="bg-primary-500/20 absolute right-0 top-0 h-96 w-96 rounded-full blur-3xl"></div>{' '}
        {/* Changed to primary color */}
        <div className="bg-secondary-500/20 absolute bottom-0 left-0 h-96 w-96 rounded-full blur-3xl"></div>{' '}
        {/* Changed to secondary color */}
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div
              className={`mb-6 transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
            >
              <span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {' '}
                {/* Changed text color for visibility */}
                <Bot className="mr-2 h-4 w-4" />
                AI-Powered University Admission Guide
              </span>
            </div>

            <h1
              className={`mb-6 text-4xl font-bold leading-tight text-gray-900 transition-all delay-200 duration-1000 dark:text-gray-100 md:text-5xl lg:text-6xl ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
            >
              Simplify Your
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {' '}
                {/* Using direct gradient for span for clarity */}
                University Journey
              </span>
            </h1>

            <p
              className={`delay-400 mb-8 max-w-2xl text-xl text-gray-700 transition-all duration-1000 dark:text-gray-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
            >
              EduWaka helps Nigerian students navigate university admissions
              with intelligent tools for institution search, course eligibility,
              fee estimation, and exam preparation.
            </p>

            <div
              className={`delay-600 mb-8 flex flex-col justify-center gap-4 transition-all duration-1000 sm:flex-row lg:justify-start ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
            >
              <Button
                size="lg"
                variant="secondary"
                className="px-8 py-4 text-lg transition-transform duration-200 hover:scale-105"
              >
                <Search className="mr-2 h-5 w-5" />
                Explore Universities
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-500 text-primary-500 dark:border-primary-300 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900 bg-transparent px-8 py-4 text-lg transition-all duration-200 hover:scale-105" // Adjusted for white background
              >
                <CheckCircle className="mr-2 h-5 w-5" />
                Check Eligibility
              </Button>
            </div>

            <div
              className={`delay-800 flex items-center justify-center space-x-8 text-gray-700 transition-all duration-1000 dark:text-gray-300 lg:justify-start ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
            >
              <div className="text-center">
                <div className="text-2xl font-bold">{universitiesCount}+</div>
                <div className="text-sm">Universities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{coursesCount}+</div>
                <div className="text-sm">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">AI</div>
                <div className="text-sm">Powered</div>
              </div>
            </div>
          </div>
          {/* Image */}
          <div
            className={`duration-1200 relative transition-all delay-300 ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}
          >
            <div className="shadow-elegant relative z-10 overflow-hidden rounded-2xl">
              <img
                src={heroIllustration}
                alt="Nigerian students studying with modern technology"
                className="h-auto w-full transform object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="absolute -right-6 -top-6 z-0 h-full w-full rounded-2xl bg-gradient-secondary opacity-30"></div>
            <div className="absolute -bottom-6 -left-6 z-0 h-full w-full rounded-2xl bg-gradient-primary opacity-20"></div>
          </div>
        </div>
      </div>

      {/* Curved bottom edge */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          className="relative block h-20 w-full fill-[hsl(192,100%,9%)] dark:fill-black"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path d="M0,60 C300,150 900,-30 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
