import { useState, type ChangeEvent, type KeyboardEvent } from 'react';

type CourseFees = {
  [course: string]: string;
  default: string;
};

type FeesData = {
  [institution: string]: CourseFees;
};

const feesData: FeesData = {
  'university of ibadan': {
    medicine: 'N350,000 per session',
    surgery: 'N350,000 per session',
    law: 'N250,000 per session',
    'computer science': 'N200,000 per session',
    default: 'N180,000 - N250,000 per session (general estimate)',
  },
  'university of lagos': {
    medicine: 'N300,000 per session',
    surgery: 'N300,000 per session',
    accounting: 'N150,000 per session',
    default: 'N120,000 - N200,000 per session (general estimate)',
  },
  'federal university of technology, akure': {
    engineering: 'N170,000 per session',
    default: 'N100,000 - N150,000 per session (general estimate)',
  },
  'university of calabar': {
    'social works': 'N80,000 - N120,000 per session',
    default: 'N70,000 - N150,000 per session (general estimate for Unical)',
  },
};

const TuitionFeeChecker = () => {
  const [institutionInput, setInstitutionInput] = useState<string>('');
  const [courseInput, setCourseInput] = useState<string>('');
  const [feeResult, setFeeResult] = useState<string>('');

  const handleCheckFees = () => {
    const lowerCaseInstitution = institutionInput.toLowerCase();
    const lowerCaseCourse = courseInput.toLowerCase();

    let estimatedFee =
      'Fees vary greatly by institution and course. Please check the official website.';

    if (feesData[lowerCaseInstitution]) {
      estimatedFee =
        feesData[lowerCaseInstitution][lowerCaseCourse] ||
        feesData[lowerCaseInstitution].default;
    } else {
      estimatedFee = `Fees vary greatly by institution and course. Please check the official website of ${institutionInput || 'the institution'}.`;
    }

    setFeeResult(
      `Estimated fee for ${courseInput || 'your chosen course'} at ${institutionInput || 'the specified institution'}: ${estimatedFee}`,
    );
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCheckFees();
    }
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
          onKeyDown={handleKeyDown}
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
            <div className="mt-4 rounded-lg border border-gray-200 bg-white p-3">
              <p className="text-red-600">
                ⚠ <span className="font-bold">Note:</span> This result may not
                be accurate. Always confirm from the institution's website as
                fees are bound to change every session.
              </p>
            </div>
            <div className="mt-4 rounded-lg border border-gray-200 bg-white p-3">
              <p className="text-gray-800">
                ℹ <span className="font-bold">Info:</span> More institution
                will be covered soon. This is just an MVP.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default TuitionFeeChecker;
