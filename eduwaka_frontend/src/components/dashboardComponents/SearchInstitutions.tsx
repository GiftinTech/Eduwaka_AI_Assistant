import { useEffect, useState, type ChangeEvent } from 'react';

interface Institution {
  id: string;
  name: string;
  type: string;
  location: string;
}

// Mock data for institutions
const mockInstitutions: Institution[] = [
  {
    id: 'uniibadan',
    name: 'University of Ibadan',
    type: 'University',
    location: 'Ibadan, Oyo State',
  },
  {
    id: 'unilag',
    name: 'University of Lagos',
    type: 'University',
    location: 'Lagos, Lagos State',
  },
  {
    id: 'oau',
    name: 'Obafemi Awolowo University',
    type: 'University',
    location: 'Ile-Ife, Osun State',
  },
  {
    id: 'abu',
    name: 'Ahmadu Bello University',
    type: 'University',
    location: 'Zaria, Kaduna State',
  },
  {
    id: 'unilorin',
    name: 'University of Ilorin',
    type: 'University',
    location: 'Ilorin, Kwara State',
  },
  {
    id: 'futa',
    name: 'Federal University of Technology, Akure',
    type: 'University',
    location: 'Akure, Ondo State',
  },
  {
    id: 'polyibadan',
    name: 'The Polytechnic, Ibadan',
    type: 'Polytechnic',
    location: 'Ibadan, Oyo State',
  },
  {
    id: 'yabatech',
    name: 'Yaba College of Technology',
    type: 'Polytechnic',
    location: 'Yaba, Lagos State',
  },
  {
    id: 'uniben',
    name: 'University of Benin',
    type: 'University',
    location: 'Benin City, Edo State',
  },
  {
    id: 'unizik',
    name: 'Nnamdi Azikiwe University',
    type: 'University',
    location: 'Awka, Anambra State',
  },
];

const SearchInstitutions = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredInstitutions, setFilteredInstitutions] = useState<
    Institution[]
  >([]);

  useEffect(() => {
    // Filter institutions based on search term
    if (searchTerm.trim() === '') {
      setFilteredInstitutions([]);
    } else {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const results = mockInstitutions.filter(
        (inst) =>
          inst.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          inst.location.toLowerCase().includes(lowerCaseSearchTerm) ||
          inst.type.toLowerCase().includes(lowerCaseSearchTerm),
      );
      setFilteredInstitutions(results);
    }
  }, [searchTerm]);

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
        <input
          type="text"
          placeholder="e.g., University of Ibadan, Lagos State University"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
        />
        {filteredInstitutions.length > 0 && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <h3 className="mb-3 text-lg font-semibold text-gray-800">
              Search Results:
            </h3>
            <ul className="space-y-2">
              {filteredInstitutions.map((inst) => (
                <li
                  key={inst.id}
                  className="rounded-lg bg-white p-3 shadow-sm transition-colors hover:bg-gray-100"
                >
                  <p className="font-medium text-gray-900">{inst.name}</p>
                  <p className="text-sm text-gray-600">
                    {inst.type} | {inst.location}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
        {searchTerm.trim() !== '' && filteredInstitutions.length === 0 && (
          <p className="mt-4 text-center text-gray-600">
            No institutions found matching "{searchTerm}".
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchInstitutions;
