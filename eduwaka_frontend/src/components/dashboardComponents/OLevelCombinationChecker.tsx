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

export const OLevelCombinationChecker = () => {
  const [courseName, setCourseName] = useState('');
  const [result, setResult] = useState('');

  const check = () => {
    const lc = courseName.toLowerCase();
    if (lc.includes('medicine') || lc.includes('surgery'))
      setResult(
        'English Language, Mathematics, Physics, Chemistry, and Biology — all at least C6.',
      );
    else if (lc.includes('computer science'))
      setResult(
        'English Language, Mathematics, Physics, Chemistry, and one other Science subject — all at least C6.',
      );
    else if (lc.includes('law'))
      setResult(
        'English Language, Literature in English, Government, Economics/History, and one other Arts/Social Science subject — all at least C6.',
      );
    else if (lc.includes('mass communication'))
      setResult(
        'English Language, Mathematics, Literature in English, Government/History/Economics, and one other Arts/Social Science subject — all at least C6.',
      );
    else if (lc.includes('english'))
      setResult(
        'English Language, Mathematics, Literature in English, and two other Arts/Social Science subjects — all at least C6.',
      );
    else
      setResult(
        "No specific combination found. Please consult the institution's official brochure.",
      );
  };

  return (
    <div>
      <PageHeader
        title="O'Level Combination Checker"
        subtitle="Check the required O'Level subject combinations for your desired course."
      />
      <Card className="space-y-4">
        <Input
          id="courseOLevel"
          label="Course Name"
          placeholder="e.g., Mass Communication"
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
            <SectionLabel>Required Subjects</SectionLabel>
            <p className="text-sm leading-relaxed text-[#111827]">{result}</p>
            <InfoBanner>
              More courses will be covered soon. This is just an MVP.
            </InfoBanner>
          </ResultCard>
        )}
      </Card>
    </div>
  );
};
export default OLevelCombinationChecker;
