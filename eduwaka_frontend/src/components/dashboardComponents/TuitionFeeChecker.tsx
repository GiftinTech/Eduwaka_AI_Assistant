import { useState, type ChangeEvent, type KeyboardEvent } from 'react';
import {
  Card,
  InfoBanner,
  Input,
  PageHeader,
  PrimaryButton,
  ResultCard,
  SectionLabel,
  WarningBanner,
} from './DashboardComponents';

// ─── TuitionFeeChecker ───────────────────────────────────────
type CourseFees = { [course: string]: string; default: string };
type FeesData = { [institution: string]: CourseFees };
const feesData: FeesData = {
  'university of ibadan': {
    medicine: '₦350,000 per session',
    surgery: '₦350,000 per session',
    law: '₦250,000 per session',
    'computer science': '₦200,000 per session',
    default: '₦180,000 – ₦250,000 per session',
  },
  'university of lagos': {
    medicine: '₦300,000 per session',
    surgery: '₦300,000 per session',
    accounting: '₦150,000 per session',
    default: '₦120,000 – ₦200,000 per session',
  },
  'federal university of technology, akure': {
    engineering: '₦170,000 per session',
    default: '₦100,000 – ₦150,000 per session',
  },
  'university of calabar': {
    'social works': '₦80,000 – ₦120,000 per session',
    default: '₦70,000 – ₦150,000 per session',
  },
};

export const TuitionFeeChecker = () => {
  const [institution, setInstitution] = useState('');
  const [course, setCourse] = useState('');
  const [result, setResult] = useState('');

  const check = () => {
    const inst = feesData[institution.toLowerCase()];
    const fee = inst
      ? (inst[course.toLowerCase()] ?? inst.default)
      : `Please check the official website of ${institution || 'the institution'}.`;
    setResult(
      `${course || 'Your chosen course'} at ${institution || 'the specified institution'}: ${fee}`,
    );
  };

  return (
    <div>
      <PageHeader
        title="Tuition / Fee Checker"
        subtitle="Estimate tuition fees and charges for various courses and institutions."
      />
      <Card className="space-y-4">
        <Input
          id="institution"
          label="Institution"
          placeholder="e.g., University of Ibadan"
          value={institution}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setInstitution(e.target.value)
          }
        />
        <Input
          id="course"
          label="Course"
          placeholder="e.g., Law"
          value={course}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setCourse(e.target.value)
          }
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
            e.key === 'Enter' && check()
          }
        />
        <PrimaryButton onClick={check}>Check Fees</PrimaryButton>
        {result && (
          <ResultCard>
            <SectionLabel>Estimated Fee</SectionLabel>
            <p className="text-sm font-semibold text-[#111827]">{result}</p>
            <WarningBanner>
              This result may not be accurate. Always confirm from the
              institution's website as fees change every session.
            </WarningBanner>
            <InfoBanner>
              More institutions will be covered soon. This is just an MVP.
            </InfoBanner>
          </ResultCard>
        )}
      </Card>
    </div>
  );
};

export default TuitionFeeChecker;
