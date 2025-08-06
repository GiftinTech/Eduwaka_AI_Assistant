import { useState, type ChangeEvent } from 'react';

const JAMBCombinationChecker = () => {
  const [courseName, setCourseName] = useState<string>('');
  const [combinationResult, setCombinationResult] = useState<string>('');

  const handleCheckCombination = () => {
    // Simple mock logic for demonstration
    const lowerCaseCourse = courseName.toLowerCase();
    if (
      lowerCaseCourse.includes('medicine') ||
      lowerCaseCourse.includes('surgery')
    ) {
      setCombinationResult(
        'For Medicine and Surgery, typical JAMB subjects are English Language, Physics, Chemistry, and Biology.',
      );
    } else if (lowerCaseCourse.includes('computer science')) {
      setCombinationResult(
        'For Computer Science, typical JAMB subjects are English Language, Mathematics, Physics, and one of Chemistry/Biology/Economics/Geography.',
      );
    } else if (lowerCaseCourse.includes('law')) {
      setCombinationResult(
        'For Law, typical JAMB subjects are English Language, Literature in English, Government/History, and one other Arts/Social Science subject.',
      );
    } else if (lowerCaseCourse.includes('english')) {
      setCombinationResult(
        'For English Language and Literature, typical JAMB subjects are English Language, Literature in English, and two other Arts/Social Science subjects.',
      );
    } else {
      setCombinationResult(
        "No specific JAMB combination found for this course in our mock data. Please consult the institution's official brochure.",
      );
    }
  };

  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold text-gray-900">
        JAMB Subject Combination Checker
      </h2>
      <p className="text-gray-700">
        Verify the correct JAMB subject combinations for your chosen course and
        institution.
      </p>
      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <label
          htmlFor="courseJAMB"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Course
        </label>
        <input
          type="text"
          id="courseJAMB"
          placeholder="e.g., Civil Engineering"
          className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
          value={courseName}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setCourseName(e.target.value)
          }
        />
        <button
          onClick={handleCheckCombination}
          className="w-full rounded-lg bg-blue-600 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Check Combination
        </button>
        {combinationResult && (
          <div className="mt-4 rounded-lg border border-gray-200 bg-white p-3">
            <p className="text-gray-600">{combinationResult}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JAMBCombinationChecker;
