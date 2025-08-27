/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, type KeyboardEvent } from 'react';

const DJANGO_API_BASE_URL = import.meta.env.VITE_DJANGO_API_BASE_URL;

interface InstitutionResponse {
  results: Institution[];
}

interface Institution {
  name: string;
  overview?: string;
}

const InstitutionOverview = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedInstitution, setSelectedInstitution] =
    useState<Institution | null>(null);
  const [isFetchingOverview, setIsFetchingOverview] = useState(false);

  // Fetch institutions for dropdown autocomplete
  useEffect(() => {
    const fetchInstitutions = async () => {
      if (searchTerm.trim() === '') {
        setInstitutions([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${DJANGO_API_BASE_URL}institutions/?search=${encodeURIComponent(
            searchTerm,
          )}`,
        );

        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const data: InstitutionResponse = await response.json();
        setInstitutions(data.results);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch institutions');
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchInstitutions, 400);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // when user clicks institution from dropdown
  const handleSelectInstitution = (name: string) => {
    setInputValue(name);
    setSearchTerm('');
    setInstitutions([]);
  };

  // Fetch overview
  const handleInstitutionOverview = async () => {
    if (!inputValue.trim()) return;

    setIsFetchingOverview(true);
    try {
      const res = await fetch(
        `${DJANGO_API_BASE_URL}ai/institution-overview/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ institution_name: inputValue }),
        },
      );
      if (!res.ok) throw new Error('Failed to fetch overview');

      const data: Institution = await res.json();
      setSelectedInstitution({ ...data, name: inputValue });
    } catch (err: any) {
      setError(err.message || 'Could not load institution overview');
    } finally {
      setIsFetchingOverview(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleInstitutionOverview();
    }
  };

  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold text-gray-900">
        Institution Overview ("Know Your Institution")
      </h2>
      <p className="text-gray-700">
        Get a comprehensive overview of Nigerian universities, including
        history, faculties, notable alumni and campus life.
      </p>

      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <label
          htmlFor="institutionOverview"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Institution Name
        </label>

        <input
          type="text"
          id="institutionOverview"
          placeholder="e.g., Obafemi Awolowo University"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setSearchTerm(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          className="mb-2 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
        />

        {/* Dropdown suggestions */}
        {institutions.length > 0 && (
          <ul className="mb-4 max-h-40 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white shadow">
            {institutions.map((inst, idx) => (
              <li
                key={idx}
                onClick={() => handleSelectInstitution(inst.name)}
                className="cursor-pointer px-4 py-2 hover:bg-gray-100"
              >
                {inst.name}
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={handleInstitutionOverview}
          className={`${isFetchingOverview ? 'cursor-wait' : 'cursor-pointer'} disabled:opacity-50" disabled:cursor-not-allowe flex w-full items-center justify-center rounded-lg bg-blue-600 py-2 font-semibold text-white transition-colors hover:bg-blue-700`}
          disabled={isFetchingOverview}
        >
          {isFetchingOverview ? (
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
              Getting Overview...{' '}
            </>
          ) : (
            'Get Overview'
          )}
        </button>

        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-3">
          {isLoading && <p className="text-gray-500">Loading...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {selectedInstitution ? (
            <div>
              <h3 className="text-xl font-semibold">
                {selectedInstitution.name}
              </h3>
              <p className="mt-2 text-gray-700">
                {selectedInstitution.overview || 'No overview available yet.'}
              </p>
              <div className="mt-4 rounded-lg border border-gray-200 bg-white p-3">
                <p className="text-gray-700">
                  ℹ <span className="font-bold">Info:</span> More details will
                  be covered soon. This is just an MVP.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">
              Detailed institution information will appear here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstitutionOverview;
