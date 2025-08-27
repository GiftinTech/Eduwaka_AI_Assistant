import { useState } from 'react';
import Button from './ui/button';
import { Minus, Plus } from 'lucide-react';

const FAQ = () => {
  const [openItem, setOpenItem] = useState<string | null>(null);

  const faqs = [
    {
      question: 'What is EduWaka?',
      answer:
        'EduWaka is an AI-powered platform that helps Nigerian students navigate their university admission journey. We provide tools to search institutions, check course eligibility, estimate fees, and prepare for CBT exams.',
    },
    {
      question: 'How accurate is the course eligibility checker?',
      answer:
        'Our eligibility checker uses official JAMB eBrochure data and NUC guidelines to provide accurate information. However, we recommend verifying with the institution directly as requirements may change.',
    },
    {
      question: 'Can I get updates about my preferred institutions?',
      answer:
        'Yes! You can subscribe to email notifications for your preferred institutions to receive updates about admission deadlines, fee changes, and important announcements.',
    },
    {
      question: 'What subjects do I need for my desired course?',
      answer:
        "Use our Subject Combination Checker to find both O'Level and JAMB subject requirements for any course. Our AI chatbot can also help answer specific questions about subject combinations.",
    },
    {
      question: 'How do I check school fees for different institutions?',
      answer:
        'Our Fee Checker tool provides estimated tuition and other fees for various institutions and courses. Fees are updated regularly, but we recommend confirming with the institution for the most current rates.',
    },
    {
      question: 'Is EduWaka free to use?',
      answer:
        "Yes, EduWaka's core features are free to use. We believe every Nigerian student should have access to quality admission guidance tools.",
    },
    {
      question: 'How can I contact support if I need help?',
      answer:
        "You can reach our support team through the Help Desk feature, use our AI chatbot for instant answers, or contact us directly through the platform. We're here to help with your admission journey.",
    },
    {
      question: 'What makes EduWaka different from other platforms?',
      answer:
        'EduWaka combines official data with AI-powered tools to provide personalized guidance. Our platform is specifically designed for Nigerian students, with features like JAMB integration and local institution focus.',
    },
  ];

  // Handler to toggle the open state of an accordion item
  const handleToggle = (value: string) => {
    setOpenItem(openItem === value ? null : value);
  };

  return (
    <section className="font-inter relative bg-gray-100 py-16 text-gray-900 dark:bg-gray-800 dark:text-gray-100">
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-gray-100 md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-700 dark:text-gray-300">
            Got questions? We've got answers. Find everything you need to know
            about EduWaka.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const itemValue = `item-${index}`;
              const isOpen = openItem === itemValue;

              return (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-600 dark:bg-gray-700"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex w-full items-center justify-between rounded-lg border-b border-input bg-gray-100 text-left transition-colors duration-200 ease-in-out hover:font-bold"
                    onClick={() => handleToggle(itemValue)}
                    aria-expanded={isOpen}
                    aria-controls={`accordion-content-${index}`}
                  >
                    <span className="text-gray-700 dark:text-gray-100">
                      {faq.question}
                    </span>

                    {isOpen ? <Minus /> : <Plus />}
                  </Button>
                  {/* Accordion Content */}
                  <div
                    id={`accordion-content-${index}`}
                    role="region"
                    aria-labelledby={`accordion-trigger-${index}`}
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen
                        ? 'max-h-screen pt-0.5 opacity-100'
                        : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="p-4 pt-2 text-gray-700 dark:text-gray-300">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
