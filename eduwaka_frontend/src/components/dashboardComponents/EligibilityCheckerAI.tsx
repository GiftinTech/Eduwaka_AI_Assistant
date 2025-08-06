/* eslint-disable @typescript-eslint/no-explicit-any */
import { Upload } from 'lucide-react';
import { useState, type ChangeEvent } from 'react';

interface AnalysisResult {
  is_eligible: boolean; // Changed from isEligible to match potential snake_case from backend
  reasons: string[];
  missing_requirements: string[]; // Changed from missingRequirements
  suggested_courses: string[]; // Changed from suggestedCourses
  o_level_credits_required: number; // Changed from oLevelCreditsRequired
  o_level_sittings_accepted: number; // Changed from oLevelSittingsAccepted
}

const EligibilityCheckerAI = () => {
  const [oLevelSitting1, setOLevelSitting1] = useState<string>('');
  const [oLevelSitting2, setOLevelSitting2] = useState<string>('');
  const [jambScore, setJambScore] = useState<string>('');
  const [jambSubjects, setJambSubjects] = useState<string>('');
  const [oLevelSittings, setOLevelSittings] = useState<string>('1'); // Default to 1 sitting
  const [desiredCourse, setDesiredCourse] = useState<string>('');
  const [institutionName, setInstitutionName] = useState<string>(''); // New state for institution
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const DJANGO_API_BASE_URL = import.meta.env.VITE_DJANGO_API_BASE_URL;

  // Function to get the JWT token from local storage (or wherever it's stored)
  const getAuthToken = (): string | null => {
    // In a real application, you'd retrieve the JWT token from secure storage (e.g., localStorage, sessionStorage)
    // For this example, we'll assume it's stored in localStorage after login.
    // Replace with your actual token retrieval logic if different.
    return localStorage.getItem('access_token'); // Assuming 'access_token' is where your JWT is stored
  };

  const handleAnalyze = async () => {
    // Basic validation
    if (
      !desiredCourse.trim() ||
      !jambScore.trim() ||
      !jambSubjects.trim() ||
      !institutionName.trim()
    ) {
      setError(
        'Please fill in all required fields (Institution Name, Desired Course, JAMB Score, JAMB Subjects).',
      );
      return;
    }
    if (oLevelSittings === '1' && !oLevelSitting1.trim()) {
      setError("Please enter your O'Level results for the 1st sitting.");
      return;
    }
    if (
      oLevelSittings === '2' &&
      (!oLevelSitting1.trim() || !oLevelSitting2.trim())
    ) {
      setError("Please enter your O'Level results for both sittings.");
      return;
    }
    const score = parseInt(jambScore);
    if (isNaN(score) || score < 0 || score > 400) {
      setError('JAMB Score must be a number between 0 and 400.');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysisResult(null);

    const authToken = getAuthToken();
    if (!authToken) {
      setError('Authentication token not found. Please log in.');
      setLoading(false);
      return;
    }

    const requestBody = {
      institution_name: institutionName,
      desired_course: desiredCourse,
      o_level_sittings: oLevelSittings,
      o_level_sitting_1: oLevelSitting1,
      o_level_sitting_2: oLevelSitting2,
      jamb_score: jambScore,
      jamb_subjects: jambSubjects,
    };

    try {
      // Make the request to your Django backend
      const response = await fetch(`${DJANGO_API_BASE_URL}eligibility-check/`, {
        // Adjust URL as needed
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`, // Include JWT token
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail ||
            errorData.message ||
            `HTTP error! status: ${response.status}`,
        );
      }

      const result = await response.json();
      setAnalysisResult(result as AnalysisResult);
    } catch (err: any) {
      console.error('Error during eligibility analysis:', err);
      setError(
        `Failed to analyze: ${err.message}. Please ensure your backend is running and you are logged in.`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold text-gray-900">
        Eligibility Checker (AI)
      </h2>
      <p className="mb-4 text-gray-700">
        Input your O'Level and JAMB results, and let our AI analyze your
        eligibility for your desired course based on Nigerian university
        requirements.
      </p>

      <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-6">
        <div>
          <label
            htmlFor="institutionName"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Institution Name (e.g., University of Ibadan)
          </label>
          <input
            type="text"
            id="institutionName"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., University of Ibadan"
            value={institutionName}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setInstitutionName(e.target.value)
            }
          />
        </div>
        <div>
          <label
            htmlFor="desiredCourse"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Desired Course (e.g., Computer Science, Medicine and Surgery)
          </label>
          <input
            type="text"
            id="desiredCourse"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., Computer Science"
            value={desiredCourse}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setDesiredCourse(e.target.value)
            }
          />
        </div>
        <div>
          <label
            htmlFor="oLevelSittings"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Number of O'Level Sittings
          </label>
          <select
            id="oLevelSittings"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
            value={oLevelSittings}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              setOLevelSittings(e.target.value);
              // Clear second sitting results if switching to 1 sitting
              if (e.target.value === '1') {
                setOLevelSitting2('');
              }
            }}
          >
            <option value="1">1 Sitting</option>
            <option value="2">2 Sittings</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="oLevelSitting1"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            O'Level Results (1st Sitting) - e.g., Maths: B2, English: C4,
            Physics: A1
          </label>
          <textarea
            id="oLevelSitting1"
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Type your subjects and grades here for 1st sitting..."
            value={oLevelSitting1}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setOLevelSitting1(e.target.value)
            }
          ></textarea>
        </div>
        {oLevelSittings === '2' && (
          <div>
            <label
              htmlFor="oLevelSitting2"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              O'Level Results (2nd Sitting) - e.g., Chemistry: B3, Biology: C5
            </label>
            <textarea
              id="oLevelSitting2"
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Type your subjects and grades here for 2nd sitting..."
              value={oLevelSitting2}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setOLevelSitting2(e.target.value)
              }
            ></textarea>
          </div>
        )}
        <div>
          <label
            htmlFor="jambScore"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Your JAMB Score (e.g., 280)
          </label>
          <input
            type="number"
            id="jambScore"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., 280"
            value={jambScore}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setJambScore(e.target.value)
            }
            min={0}
            max={400}
          />
        </div>
        <div>
          <label
            htmlFor="jambSubjects"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Your JAMB Subjects (e.g., English, Physics, Chemistry, Biology)
          </label>
          <input
            type="text"
            id="jambSubjects"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., English, Physics, Chemistry, Biology"
            value={jambSubjects}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setJambSubjects(e.target.value)
            }
          />
        </div>

        <button
          onClick={handleAnalyze}
          className="flex w-full items-center justify-center rounded-lg bg-blue-600 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg
                className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 1116 0A8 8 0 014 12z"
                ></path>
              </svg>
              Analyzing...
            </>
          ) : (
            <>
              <Upload size={20} className="mr-2" />
              Analyze Eligibility
            </>
          )}
        </button>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-100 p-3 text-red-700">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {analysisResult && (
          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-md">
            <h3 className="mb-3 text-xl font-semibold text-gray-900">
              Analysis Result:
            </h3>
            <p
              className={`text-lg font-bold ${analysisResult.is_eligible ? 'text-green-600' : 'text-red-600'} mb-2`}
            >
              Eligibility:{' '}
              {analysisResult.is_eligible ? 'Eligible!' : 'Not Eligible'}
            </p>
            {analysisResult.reasons && analysisResult.reasons.length > 0 && (
              <div className="mb-2">
                <p className="font-medium text-gray-800">Reasons:</p>
                <ul className="ml-4 list-inside list-disc text-gray-700">
                  {analysisResult.reasons.map((reason, index) => (
                    <li key={index}>{reason}</li>
                  ))}
                </ul>
              </div>
            )}
            {analysisResult.missing_requirements &&
              analysisResult.missing_requirements.length > 0 && (
                <div className="mb-2">
                  <p className="font-medium text-red-700">
                    Missing Requirements:
                  </p>
                  <ul className="ml-4 list-inside list-disc text-red-600">
                    {analysisResult.missing_requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
            {analysisResult.suggested_courses &&
              analysisResult.suggested_courses.length > 0 && (
                <div>
                  <p className="font-medium text-blue-700">
                    Suggested Courses you can study instead of {desiredCourse}:
                  </p>
                  <ul className="ml-4 list-inside list-disc text-blue-600">
                    {analysisResult.suggested_courses.map((course, index) => (
                      <li key={index}>{course}</li>
                    ))}
                  </ul>
                </div>
              )}
            {analysisResult.o_level_credits_required && (
              <p className="mt-2 text-gray-700">
                <span className="font-medium">
                  O'Level Credits Typically Required:
                </span>{' '}
                {analysisResult.o_level_credits_required}
              </p>
            )}
            {analysisResult.o_level_sittings_accepted && (
              <p className="text-gray-700">
                <span className="font-medium">
                  O'Level Sittings Typically Accepted:
                </span>{' '}
                {analysisResult.o_level_sittings_accepted}
              </p>
            )}
            {!analysisResult.reasons.length &&
              !analysisResult.missing_requirements.length &&
              !analysisResult.suggested_courses.length && (
                <p className="text-gray-600">
                  No specific details provided by AI. Please try rephrasing your
                  input.
                </p>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EligibilityCheckerAI;
