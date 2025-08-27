/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, type ChangeEvent } from 'react';

export interface Institution {
  id: string;
  name: string;
  ownership_type: string;
  state: string;
  year_of_establishment: string;
  website: string;
}

export interface InstitutionResponse {
  results: Institution[];
  count: number;
  next: string | null;
  previous: string | null;
}

const DJANGO_API_BASE_URL = import.meta.env.VITE_DJANGO_API_BASE_URL;

const SearchInstitutions = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedInstitution, setSelectedInstitution] =
    useState<Institution | null>(null);

  // Fetch institutions whenever searchTerm changes
  useEffect(() => {
    const fetchInstitutions = async () => {
      if (searchTerm.trim() === '') {
        setInstitutions([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        // backend should support query param like ?search=term
        const response = await fetch(
          `${DJANGO_API_BASE_URL}institutions/?search=${encodeURIComponent(
            searchTerm,
          )}`,
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data: InstitutionResponse = await response.json();
        setInstitutions(data.results);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch institutions');
      } finally {
        setIsLoading(false);
      }
    };

    // debounce: only fetch when user stops typing for ~400ms
    const timeoutId = setTimeout(fetchInstitutions, 400);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // fetch single institution details
  const handleSelectInstitution = async (id: string) => {
    const res = await fetch(`${DJANGO_API_BASE_URL}institutions/${id}/`);
    const data: Institution = await res.json();
    setSelectedInstitution(data);
  };

  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold text-gray-900">
        Search for Institutions
      </h2>
      <p className="text-gray-700">
        Search for universities, polytechnics and colleges of education in
        Nigeria.
      </p>

      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        {/* Search input */}
        <input
          type="text"
          placeholder="e.g., University of Ibadan, Lagos State University"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
        />

        {/* Loading & errors */}
        {isLoading && (
          <p className="mt-4 text-center text-gray-600">
            Loading institutions...
          </p>
        )}
        {error && <p className="mt-4 text-center text-red-600">{error}</p>}

        {/* Search results */}
        {institutions.length > 0 && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <h3 className="mb-3 text-lg font-semibold text-gray-800">
              Search Results:
            </h3>
            <ul className="space-y-2">
              {institutions.map((inst) => (
                <li
                  key={inst.id}
                  onClick={() => handleSelectInstitution(inst.id)} // 👈 add this
                  className="cursor-pointer rounded-lg bg-white p-3 shadow-sm transition-colors hover:bg-gray-100"
                >
                  <p className="font-medium text-gray-900">{inst.name}</p>
                  <p className="text-sm text-gray-600">
                    {inst.ownership_type} | {inst.state}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* No results */}
        {searchTerm.trim() !== '' &&
          institutions.length === 0 &&
          !isLoading && (
            <p className="mt-4 text-center text-gray-600">
              No institutions found matching "{searchTerm}".
            </p>
          )}

        {/* Institution details 👇 */}
        {selectedInstitution && (
          <div className="mt-6 rounded-lg border bg-white p-4 shadow">
            <h3 className="text-xl font-semibold text-gray-900">
              {selectedInstitution.name}
            </h3>
            <p className="text-gray-700">{selectedInstitution.state}</p>
            <p className="text-gray-700">
              {selectedInstitution.ownership_type} University
            </p>
            <p className="text-gray-700">
              Established: {selectedInstitution.year_of_establishment}
            </p>
            <a
              href={selectedInstitution.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-blue-600 hover:underline"
            >
              Visit Website
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchInstitutions;
