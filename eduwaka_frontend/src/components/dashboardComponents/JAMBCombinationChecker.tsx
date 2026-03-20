import { useState, type ChangeEvent, type KeyboardEvent } from 'react';
import {
  Card,
  InfoBanner,
  Input,
  PageHeader,
  PrimaryButton,
  ResultCard,
  SectionLabel,
} from './DashboardComponents';

const JAMBCombinationChecker = () => {
  const [courseName, setCourseName] = useState('');
  const [result, setResult] = useState('');

  const check = () => {
    const lc = courseName.toLowerCase();
    if (lc.includes('medicine') || lc.includes('surgery'))
      setResult('English Language, Physics, Chemistry, and Biology.');
    else if (lc.includes('computer science'))
      setResult(
        'English Language, Mathematics, Physics, and one of Chemistry/Biology/Economics/Geography.',
      );
    else if (lc.includes('law'))
      setResult(
        'English Language, Literature in English, Government/History, and one other Arts/Social Science subject.',
      );
    else if (lc.includes('english'))
      setResult(
        'English Language, Literature in English, and two other Arts/Social Science subjects.',
      );
    else
      setResult(
        "No specific combination found. Please consult the institution's official brochure.",
      );
  };

  return (
    <div>
      <PageHeader
        title="JAMB Combination Checker"
        subtitle="Verify the correct JAMB subject combinations for your chosen course."
      />
      <Card className="space-y-4">
        <Input
          id="courseJAMB"
          label="Course Name"
          placeholder="e.g., Civil Engineering"
          value={courseName}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setCourseName(e.target.value)
          }
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
            e.key === 'Enter' && check()
          }
        />
        <PrimaryButton onClick={check}>Check Combination</PrimaryButton>
        {result && (
          <ResultCard>
            <SectionLabel>JAMB Subjects</SectionLabel>
            <p className="text-sm leading-relaxed text-[#111827]">{result}</p>
            <InfoBanner>
              More combinations will be covered soon. This is just an MVP.
            </InfoBanner>
          </ResultCard>
        )}
      </Card>
    </div>
  );
};

export default JAMBCombinationChecker;
