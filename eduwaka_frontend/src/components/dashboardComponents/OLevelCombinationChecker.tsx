import { useState, type ChangeEvent } from 'react';

const OLevelCombinationChecker = () => {
  const [courseName, setCourseName] = useState<string>('');
  const [combinationResult, setCombinationResult] = useState<string>('');

  const handleCheckCombination = () => {
    const lowerCaseCourse = courseName.toLowerCase();
    if (
      lowerCaseCourse.includes('medicine') ||
      lowerCaseCourse.includes('surgery')
    ) {
      setCombinationResult(
        "For Medicine and Surgery, typical O'Level subjects are English Language, Mathematics, Physics, Chemistry, and Biology (all with at least C6).",
      );
    } else if (lowerCaseCourse.includes('computer science')) {
      setCombinationResult(
        "For Computer Science, typical O'Level subjects are English Language, Mathematics, Physics, Chemistry, and one other Science subject (e.g., Biology, Further Mathematics) (all with at least C6).",
      );
    } else if (lowerCaseCourse.includes('law')) {
      setCombinationResult(
        "For Law, typical O'Level subjects are English Language, Literature in English, Government, Economics/History, and one other Arts/Social Science subject (all with at least C6).",
      );
    } else if (lowerCaseCourse.includes('mass communication')) {
      setCombinationResult(
        "For Mass Communication, typical O'Level subjects are English Language, Mathematics, Literature in English, Government/History/Economics, and one other Arts/Social Science subject (all with at least C6).",
      );
    } else if (lowerCaseCourse.includes('english')) {
      setCombinationResult(
        "For English Language and Literature, typical O'Level subjects are English Language, Mathematics, Literature in English, and two other Arts/Social Science subjects (all with at least C6).",
      );
    } else {
      setCombinationResult(
        "No specific O'Level combination found for this course in our mock data. Please consult the institution's official brochure.",
      );
    }
  };

  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold text-gray-900">
        O'Level Subject Combination Checker
      </h2>
      <p className="text-gray-700">
        Check the required O'Level subject combinations for your desired
        courses.
      </p>
      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <label
          htmlFor="courseOLevel"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Course
        </label>
        <input
          type="text"
          id="courseOLevel"
          placeholder="e.g., Mass Communication"
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

export default OLevelCombinationChecker;
