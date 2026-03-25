/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Upload, X, Plus } from 'lucide-react';
import type { Institution, InstitutionResponse } from './SearchInstitutions';

// ── Subject data ──────────────────────────────────────────────────────────────

const WAEC_SUBJECTS = [
  'Agricultural Science',
  'Animal Husbandry',
  'Arabic',
  'Auto Mechanics',
  'Biology',
  'Building Construction',
  'Chemistry',
  'Christian Religious Studies',
  'Civic Education',
  'Commerce',
  'Computer Studies',
  'Data Processing',
  'Economics',
  'Electrical Installation & Maintenance',
  'English Language',
  'Food & Nutrition',
  'French',
  'Further Mathematics',
  'Geography',
  'Government',
  'Hausa',
  'History',
  'Home Management',
  'Igbo',
  'Information & Communication Technology',
  'Islamic Religious Studies',
  'Literature in English',
  'Mathematics',
  'Metal Work',
  'Music',
  'Painting & Decorating',
  'Physical & Health Education',
  'Physics',
  'Plumbing & Pipe Fitting',
  'Printing Craft Practice',
  'Technical Drawing',
  'Typewriting',
  'Visual Art',
  'Woodwork',
  'Yoruba',
];

const JAMB_SUBJECTS = [
  'Accounting',
  'Agricultural Science',
  'Arabic',
  'Biology',
  'Chemistry',
  'Christian Religious Knowledge',
  'Commerce',
  'Computer Studies',
  'Economics',
  'English Language',
  'French',
  'Geography',
  'Government',
  'Hausa',
  'History',
  'Igbo',
  'Islamic Religious Knowledge',
  'Literature in English',
  'Mathematics',
  'Music',
  'Physical Education',
  'Physics',
  'Principles of Accounts',
  'Technical Drawing',
  'Yoruba',
];

const GRADE_OPTIONS = ['A1', 'B2', 'B3', 'C4', 'C5', 'C6', 'D7', 'E8', 'F9'];

// ── Types ─────────────────────────────────────────────────────────────────────

interface SubjectGrade {
  id: string;
  subject: string;
  grade: string;
}

interface AnalysisResult {
  eligibility_status?: string;
  is_eligible: boolean;
  reasons: string[];
  missing_requirements: string[];
  recommended_actions?: string[] | null;
  suggested_courses: string[];
  o_level_credits_required: number;
  o_level_sittings_accepted: number;
  jamb_subject_match?: boolean;
  jamb_subject_issues?: string[] | null;
}

// ── SubjectGradeRow ───────────────────────────────────────────────────────────

interface SubjectGradeRowProps {
  row: SubjectGrade;
  subjectList: string[];
  usedSubjects: string[];
  onChange: (id: string, field: 'subject' | 'grade', value: string) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

const SubjectGradeRow = ({
  row,
  subjectList,
  usedSubjects,
  onChange,
  onRemove,
  canRemove,
}: SubjectGradeRowProps) => {
  const [query, setQuery] = useState(row.subject);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = subjectList.filter(
    (s) =>
      s.toLowerCase().includes(query.toLowerCase()) &&
      (s === row.subject || !usedSubjects.includes(s)),
  );

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        // If typed text doesn't match any subject exactly, reset to last valid
        if (!subjectList.includes(query)) {
          setQuery(row.subject);
        }
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [query, row.subject, subjectList]);

  const select = (subject: string) => {
    setQuery(subject);
    onChange(row.id, 'subject', subject);
    setOpen(false);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Subject autocomplete */}
      <div className="relative flex-1" ref={containerRef}>
        <input
          type="text"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Subject (e.g., Mathematics)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(row.id, 'subject', ''); // clear valid subject while typing
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />
        {open && filtered.length > 0 && (
          <ul className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
            {filtered.map((s) => (
              <li
                key={s}
                onMouseDown={() => select(s)}
                className="cursor-pointer px-3 py-2 text-sm hover:bg-[#eb479910] hover:text-[#eb4799]"
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Grade select */}
      <select
        className="w-24 rounded-lg border border-gray-300 px-2 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        value={row.grade}
        onChange={(e) => onChange(row.id, 'grade', e.target.value)}
      >
        <option value="">Grade</option>
        {GRADE_OPTIONS.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>

      {/* Remove button */}
      {canRemove && (
        <button
          type="button"
          onClick={() => onRemove(row.id)}
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
          title="Remove subject"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
};

// ── JambSubjectPicker ─────────────────────────────────────────────────────────

interface JambSubjectPickerProps {
  selected: string[];
  onChange: (subjects: string[]) => void;
}

const JambSubjectPicker = ({ selected, onChange }: JambSubjectPickerProps) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = JAMB_SUBJECTS.filter(
    (s) =>
      s.toLowerCase().includes(query.toLowerCase()) && !selected.includes(s),
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const add = (subject: string) => {
    if (selected.length >= 4) return;
    onChange([...selected, subject]);
    setQuery('');
    setOpen(false);
  };

  const remove = (subject: string) => {
    onChange(selected.filter((s) => s !== subject));
  };

  return (
    <div className="space-y-2">
      {/* Selected tags */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((s) => (
            <span
              key={s}
              className="flex items-center gap-1 rounded-full border border-[#eb479940] bg-[#eb479910] px-3 py-1 text-sm text-[#eb4799]"
            >
              {s}
              <button
                type="button"
                onClick={() => remove(s)}
                className="ml-1 rounded-full text-[#eb4799] transition-colors hover:text-red-600"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Autocomplete input — hide when 4 selected */}
      {selected.length < 4 && (
        <div className="relative" ref={containerRef}>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder={`Add subject ${selected.length + 1} of 4…`}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
          />
          {open && filtered.length > 0 && (
            <ul className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
              {filtered.map((s) => (
                <li
                  key={s}
                  onMouseDown={() => add(s)}
                  className="cursor-pointer px-3 py-2 text-sm hover:bg-[#eb479910] hover:text-[#eb4799]"
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <p className="text-xs text-gray-400">
        {selected.length}/4 subjects selected (JAMB requires exactly 4)
      </p>
    </div>
  );
};

// ── OLevelSittingInput ────────────────────────────────────────────────────────

interface OLevelSittingInputProps {
  label: string;
  rows: SubjectGrade[];
  onChange: (rows: SubjectGrade[]) => void;
}

const makeRow = (): SubjectGrade => ({
  id: crypto.randomUUID(),
  subject: '',
  grade: '',
});

const OLevelSittingInput = ({
  label,
  rows,
  onChange,
}: OLevelSittingInputProps) => {
  const usedSubjects = rows.map((r) => r.subject).filter(Boolean);

  const update = (id: string, field: 'subject' | 'grade', value: string) => {
    onChange(rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const remove = (id: string) => {
    onChange(rows.filter((r) => r.id !== id));
  };

  const add = () => {
    if (rows.length >= 9) return; // WAEC max subjects
    onChange([...rows, makeRow()]);
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="space-y-2 rounded-lg border border-gray-200 bg-white p-3">
        {rows.map((row) => (
          <SubjectGradeRow
            key={row.id}
            row={row}
            subjectList={WAEC_SUBJECTS}
            usedSubjects={usedSubjects}
            onChange={update}
            onRemove={remove}
            canRemove={rows.length > 1}
          />
        ))}

        {rows.length < 9 && (
          <button
            type="button"
            onClick={add}
            className="mt-1 flex items-center gap-1 text-xs text-[#eb4799] transition-opacity hover:opacity-75"
          >
            <Plus size={13} />
            Add subject
          </button>
        )}
      </div>
      <p className="mt-1 text-xs text-gray-400">
        {rows.filter((r) => r.subject && r.grade).length} subject(s) entered
      </p>
    </div>
  );
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const rowsToString = (rows: SubjectGrade[]): string =>
  rows
    .filter((r) => r.subject && r.grade)
    .map((r) => `${r.subject}: ${r.grade}`)
    .join(', ');

const defaultRows = (): SubjectGrade[] => Array.from({ length: 5 }, makeRow);

// ── Main component ────────────────────────────────────────────────────────────

const EligibilityCheckerAI = () => {
  const [sitting1Rows, setSitting1Rows] =
    useState<SubjectGrade[]>(defaultRows());
  const [sitting2Rows, setSitting2Rows] =
    useState<SubjectGrade[]>(defaultRows());
  const [jambScore, setJambScore] = useState<string>('');
  const [jambSubjects, setJambSubjects] = useState<string[]>([]);
  const [oLevelSittings, setOLevelSittings] = useState<string>('1');
  const [desiredCourse, setDesiredCourse] = useState<string>('');
  const [institutionName, setInstitutionName] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const [institutionResults, setInstitutionResults] = useState<Institution[]>(
    [],
  );
  const [showDropdown, setShowDropdown] = useState(false);

  const DJANGO_API_BASE_URL = import.meta.env.VITE_DJANGO_API_BASE_URL;
  const getAuthToken = (): string | null =>
    localStorage.getItem('access_token');

  // Institution autocomplete
  useEffect(() => {
    const fetchInstitutions = async () => {
      if (institutionName.trim().length < 2) {
        setInstitutionResults([]);
        return;
      }
      try {
        const response = await fetch(
          `${DJANGO_API_BASE_URL}institutions/?search=${institutionName}`,
        );
        const data: InstitutionResponse = await response.json();
        setInstitutionResults(data.results || []);
        setShowDropdown(true);
      } catch (err) {
        console.error('Error fetching institutions:', err);
      }
    };
    const delay = setTimeout(fetchInstitutions, 400);
    return () => clearTimeout(delay);
  }, [institutionName, DJANGO_API_BASE_URL]);

  const handleAnalyze = async () => {
    const oLevelSitting1 = rowsToString(sitting1Rows);
    const oLevelSitting2 = rowsToString(sitting2Rows);

    // Validation
    if (!desiredCourse.trim() || !jambScore.trim() || !institutionName.trim()) {
      setError(
        'Please fill in all required fields (Institution Name, Desired Course, JAMB Score).',
      );
      return;
    }
    if (jambSubjects.length !== 4) {
      setError('Please select exactly 4 JAMB subjects.');
      return;
    }
    if (oLevelSittings === '1' && !oLevelSitting1) {
      setError(
        "Please enter at least one O'Level subject and grade for the 1st sitting.",
      );
      return;
    }
    if (oLevelSittings === '2' && (!oLevelSitting1 || !oLevelSitting2)) {
      setError("Please enter O'Level results for both sittings.");
      return;
    }
    const score = parseInt(jambScore);
    if (isNaN(score) || score < 0 || score > 400) {
      setError('JAMB Score must be a number between 0 and 400.');
      return;
    }

    const authToken = getAuthToken();
    if (!authToken) {
      setError('Please log in to use the Eligibility Checker.');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysisResult(null);

    const requestBody = {
      institution_name: institutionName,
      desired_course: desiredCourse,
      o_level_sittings: oLevelSittings,
      o_level_sitting_1: oLevelSitting1,
      o_level_sitting_2: oLevelSitting2,
      jamb_score: jambScore,
      jamb_subjects: jambSubjects.join(', '),
    };

    try {
      const response = await fetch(
        `${DJANGO_API_BASE_URL}ai/eligibility-check/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(requestBody),
        },
      );

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
      setError('Failed to analyze. Please ensure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  // ── Status badge helper ─────────────────────────────────────────────────────
  const statusConfig = analysisResult
    ? analysisResult.eligibility_status === 'eligible' ||
      analysisResult.is_eligible
      ? {
          label: 'Eligible',
          color: 'text-green-600',
          bg: 'bg-green-50 border-green-200',
        }
      : analysisResult.eligibility_status === 'not_viable'
        ? {
            label: 'Not Viable',
            color: 'text-red-600',
            bg: 'bg-red-50 border-red-200',
          }
        : {
            label: 'Fixable',
            color: 'text-amber-600',
            bg: 'bg-amber-50 border-amber-200',
          }
    : null;

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
        {/* Institution */}
        <div className="relative">
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
            onFocus={() =>
              institutionResults.length > 0 && setShowDropdown(true)
            }
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          />
          {showDropdown && institutionResults.length > 0 && (
            <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg">
              {institutionResults.map((inst) => (
                <li
                  key={inst.id}
                  onMouseDown={() => {
                    setInstitutionName(inst.name);
                    setShowDropdown(false);
                  }}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                >
                  {inst.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Desired Course */}
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

        {/* O'Level Sittings */}
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
              if (e.target.value === '1') setSitting2Rows(defaultRows());
            }}
          >
            <option value="1">1 Sitting</option>
            <option value="2">2 Sittings</option>
          </select>
        </div>

        {/* O'Level Sitting 1 */}
        <OLevelSittingInput
          label="O'Level Results — 1st Sitting"
          rows={sitting1Rows}
          onChange={setSitting1Rows}
        />

        {/* O'Level Sitting 2 */}
        {oLevelSittings === '2' && (
          <OLevelSittingInput
            label="O'Level Results — 2nd Sitting"
            rows={sitting2Rows}
            onChange={setSitting2Rows}
          />
        )}

        {/* JAMB Score */}
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

        {/* JAMB Subjects */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Your JAMB Subjects (select exactly 4)
          </label>
          <JambSubjectPicker
            selected={jambSubjects}
            onChange={setJambSubjects}
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleAnalyze}
          className="flex w-full items-center justify-center rounded-lg bg-[#eb4799] py-2 font-semibold text-white transition-colors hover:bg-[#eb4799f1] disabled:cursor-not-allowed disabled:opacity-50"
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 1116 0A8 8 0 014 12z"
                />
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

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-100 p-3 text-red-700">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Result */}
        {analysisResult && statusConfig && (
          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-md">
            <h3 className="mb-3 text-xl font-semibold text-gray-900">
              Analysis Result:
            </h3>

            {/* Status badge */}
            <div
              className={`mb-4 inline-flex items-center rounded-full border px-4 py-1 ${statusConfig.bg}`}
            >
              <span className={`text-sm font-semibold ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
            </div>

            {/* Reasons */}
            {analysisResult.reasons?.length > 0 && (
              <div className="mb-3">
                <p className="font-medium text-gray-800">Reasons:</p>
                <ul className="ml-4 list-inside list-disc text-gray-700">
                  {analysisResult.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Missing requirements */}
            {analysisResult.missing_requirements?.length > 0 && (
              <div className="mb-3">
                <p className="font-medium text-red-700">
                  Missing Requirements:
                </p>
                <ul className="ml-4 list-inside list-disc text-red-600">
                  {analysisResult.missing_requirements.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommended actions — new field from backend refactor */}
            {(analysisResult.recommended_actions?.length ?? 0) > 0 && (
              <div className="mb-3">
                <p className="font-medium text-blue-800">
                  Recommended Actions:
                </p>
                <ol className="ml-4 list-inside list-decimal text-blue-700">
                  {analysisResult.recommended_actions!.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ol>
              </div>
            )}

            {/* JAMB subject issues — new field */}
            {(analysisResult.jamb_subject_issues?.length ?? 0) > 0 && (
              <div className="mb-3">
                <p className="font-medium text-amber-700">
                  JAMB Subject Issues:
                </p>
                <ul className="ml-4 list-inside list-disc text-amber-600">
                  {analysisResult.jamb_subject_issues!.map((issue, idx) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggested courses */}
            {analysisResult.suggested_courses?.length > 0 && (
              <div className="mb-3">
                <p className="font-medium text-blue-700">
                  Suggested Courses you can study instead of {desiredCourse}:
                </p>
                <ul className="ml-4 list-inside list-disc text-blue-600">
                  {analysisResult.suggested_courses.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Meta */}
            {!!analysisResult.o_level_credits_required && (
              <p className="mt-2 text-gray-700">
                <span className="font-medium">
                  O'Level Credits Typically Required:
                </span>{' '}
                {analysisResult.o_level_credits_required}
              </p>
            )}
            {!!analysisResult.o_level_sittings_accepted && (
              <p className="text-gray-700">
                <span className="font-medium">
                  O'Level Sittings Typically Accepted:
                </span>{' '}
                {analysisResult.o_level_sittings_accepted}
              </p>
            )}

            {!analysisResult.reasons?.length &&
              !analysisResult.missing_requirements?.length &&
              !analysisResult.suggested_courses?.length && (
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
