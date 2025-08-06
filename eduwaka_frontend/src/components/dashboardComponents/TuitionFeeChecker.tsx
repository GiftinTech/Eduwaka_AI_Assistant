import { useState, type ChangeEvent } from 'react';

const TuitionFeeChecker = () => {
  const [institutionInput, setInstitutionInput] = useState<string>('');
  const [courseInput, setCourseInput] = useState<string>('');
  const [feeResult, setFeeResult] = useState<string>('');

  const handleCheckFees = () => {
    const lowerCaseInstitution = institutionInput.toLowerCase();
    const lowerCaseCourse = courseInput.toLowerCase();
    let estimatedFee = 'N/A';

    if (lowerCaseInstitution.includes('university of ibadan')) {
      if (
        lowerCaseCourse.includes('medicine') ||
        lowerCaseCourse.includes('surgery')
      ) {
        estimatedFee = 'N350,000 per session';
      } else if (lowerCaseCourse.includes('law')) {
        estimatedFee = 'N250,000 per session';
      } else if (lowerCaseCourse.includes('computer science')) {
        estimatedFee = 'N200,000 per session';
      } else {
        estimatedFee = 'N180,000 - N250,000 per session (general estimate)';
      }
    } else if (lowerCaseInstitution.includes('university of lagos')) {
      if (
        lowerCaseCourse.includes('medicine') ||
        lowerCaseCourse.includes('surgery')
      ) {
        estimatedFee = 'N300,000 per session';
      } else if (lowerCaseCourse.includes('accounting')) {
        estimatedFee = 'N150,000 per session';
      } else {
        estimatedFee = 'N120,000 - N200,000 per session (general estimate)';
      }
    } else if (
      lowerCaseInstitution.includes('federal university of technology, akure')
    ) {
      if (lowerCaseCourse.includes('engineering')) {
        estimatedFee = 'N170,000 per session';
      } else {
        estimatedFee = 'N100,000 - N150,000 per session (general estimate)';
      }
    } else if (lowerCaseInstitution.includes('university of calabar')) {
      if (lowerCaseCourse.includes('social works')) {
        estimatedFee = 'N80,000 - N120,000 per session'; // Mock fee for Social Works at UniCal
      } else {
        estimatedFee =
          'N70,000 - N150,000 per session (general estimate for UniCal)';
      }
    } else {
      estimatedFee =
        'Fees vary greatly by institution and course. Please check the official website of ' +
        (institutionInput || 'the institution') +
        '.';
    }
    setFeeResult(
      `Estimated fee for ${courseInput || 'your chosen course'} at ${institutionInput || 'the specified institution'}: ${estimatedFee}`,
    );
  };

  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold text-gray-900">
        Tuition/Fee Checker
      </h2>
      <p className="text-gray-700">
        Estimate tuition fees and other charges for various courses and
        institutions.
      </p>
      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <label
          htmlFor="institution"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Institution
        </label>
        <input
          type="text"
          id="institution"
          placeholder="e.g., University of Ibadan"
          className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
          value={institutionInput}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setInstitutionInput(e.target.value)
          }
        />

        <label
          htmlFor="course"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Course
        </label>
        <input
          type="text"
          id="course"
          placeholder="e.g., Law"
          className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
          value={courseInput}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setCourseInput(e.target.value)
          }
        />

        <button
          onClick={handleCheckFees}
          className="w-full rounded-lg bg-blue-600 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Check Fees
        </button>
        {feeResult && (
          <div className="mt-4 rounded-lg border border-gray-200 bg-white p-3">
            <p className="text-gray-600">{feeResult}</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default TuitionFeeChecker;
