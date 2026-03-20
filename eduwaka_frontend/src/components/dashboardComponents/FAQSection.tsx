import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from './DashboardComponents';

const FAQItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white">
      <button
        className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-[#111827] transition-colors hover:bg-[#f9fafb]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <span className="ml-4 flex-shrink-0 text-[#eb4799]">
          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </span>
      </button>
      {isOpen && (
        <div className="border-t border-[#e5e7eb] px-5 py-4">
          <p className="text-sm leading-relaxed text-[#6b7280]">{answer}</p>
        </div>
      )}
    </div>
  );
};

const FAQSection = () => (
  <div>
    <PageHeader
      title="Frequently Asked Questions"
      subtitle="Find answers to common questions about university admissions and EduWaka features."
    />
    <div className="space-y-3">
      <FAQItem
        question="How accurate is the eligibility checker?"
        answer="Our eligibility checker uses a rule-based system combined with AI insights to provide highly accurate assessments based on official admission requirements. However, always confirm with the institution."
      />
      <FAQItem
        question="Can I save my favourite courses and institutions?"
        answer="Yes, once logged in, you can save institutions and courses to your personalised dashboard for easy access."
      />
      <FAQItem
        question="Is EduWaka free to use?"
        answer="The basic features of EduWaka are free. Premium features and advanced AI tools may require a subscription."
      />
    </div>
  </div>
);

export default FAQSection;
