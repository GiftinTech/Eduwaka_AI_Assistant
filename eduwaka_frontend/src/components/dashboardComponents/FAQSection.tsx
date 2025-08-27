import { useState } from 'react';
import Button from '../ui/button';
import { Minus, Plus } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50">
      <Button
        variant="ghost"
        className="flex w-full items-center justify-between rounded-lg text-left font-medium text-gray-800 hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        {isOpen ? <Minus /> : <Plus />}
      </Button>
      {isOpen && (
        <div className="p-4 pt-0 text-gray-600">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

const FAQSection = () => (
  <div>
    <h2 className="mb-6 text-3xl font-bold text-gray-900">
      Frequently Asked Questions (FAQ)
    </h2>
    <p className="text-gray-700">
      Find answers to common questions about university admissions, EduWaka
      features, and more.
    </p>
    <div className="mt-6 space-y-4">
      <FAQItem
        question="How accurate is the eligibility checker?"
        answer="Our eligibility checker uses a rule-based system combined with AI insights to provide highly accurate assessments based on official admission requirements. However, always confirm with the institution."
      />
      <FAQItem
        question="Can I save my favorite courses and institutions?"
        answer="Yes, once logged in, you can save institutions and courses to your personalized dashboard for easy access."
      />
      <FAQItem
        question="Is EduWaka free to use?"
        answer="The basic features of EduWaka are free. Premium features and advanced AI tools may require a subscription."
      />
    </div>
  </div>
);

export default FAQSection;
