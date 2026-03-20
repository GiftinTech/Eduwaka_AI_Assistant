/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, type ChangeEvent } from 'react';
import { Search, ExternalLink, MapPin, Building2 } from 'lucide-react';
import { PageHeader, ErrorMessage } from './DashboardComponents';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Institution | null>(null);

  useEffect(() => {
    const fetch_ = async () => {
      if (!searchTerm.trim()) {
        setInstitutions([]);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${DJANGO_API_BASE_URL}institutions/?search=${encodeURIComponent(searchTerm)}`,
        );
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data: InstitutionResponse = await res.json();
        setInstitutions(data.results);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch institutions');
      } finally {
        setIsLoading(false);
      }
    };
    const t = setTimeout(fetch_, 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const handleSelect = async (id: string) => {
    const res = await fetch(`${DJANGO_API_BASE_URL}institutions/${id}/`);
    const data: Institution = await res.json();
    setSelected(data);
  };

  return (
    <div>
      <PageHeader
        title="Search Institutions"
        subtitle="Find universities, polytechnics and colleges of education in Nigeria."
      />

      {/* Search */}
      <div className="relative mb-6">
        <Search
          size={15}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af]"
        />
        <input
          type="text"
          placeholder="e.g., University of Ibadan, Lagos State University"
          className="w-full rounded-xl border border-[#e5e7eb] bg-white py-3 pl-10 pr-4 text-sm text-[#111827] placeholder-[#9ca3af] transition-all focus:border-[#eb4799] focus:outline-none focus:ring-2 focus:ring-[#eb4799]/20"
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(e.target.value);
            setSelected(null);
          }}
        />
      </div>

      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} />
        </div>
      )}

      {/* Results list */}
      {!selected && institutions.length > 0 && (
        <div className="space-y-2">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#9ca3af]">
            {institutions.length} result{institutions.length !== 1 ? 's' : ''}
          </p>
          {institutions.map((inst) => (
            <button
              key={inst.id}
              onClick={() => handleSelect(inst.id)}
              className="group flex w-full items-center justify-between rounded-xl border border-[#e5e7eb] bg-white px-5 py-4 text-left transition-all hover:border-[#eb4799]/30 hover:bg-[#fdf4f9] hover:shadow-sm"
            >
              <div>
                <p className="text-sm font-semibold text-[#111827] group-hover:text-[#eb4799]">
                  {inst.name}
                </p>
                <p className="mt-0.5 text-xs text-[#6b7280]">
                  {inst.ownership_type} · {inst.state}
                </p>
              </div>
              <Building2
                size={15}
                className="flex-shrink-0 text-[#d1d5db] group-hover:text-[#eb4799]"
              />
            </button>
          ))}
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <svg
            className="h-6 w-6 animate-spin text-[#eb4799]"
            viewBox="0 0 24 24"
            fill="none"
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
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </div>
      )}

      {searchTerm.trim() && !institutions.length && !isLoading && (
        <p className="py-8 text-center text-sm text-[#9ca3af]">
          No institutions found matching "{searchTerm}".
        </p>
      )}

      {/* Detail card */}
      {selected && (
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
          <button
            onClick={() => setSelected(null)}
            className="mb-4 text-xs font-bold text-[#eb4799] transition-colors hover:text-[#d43589]"
          >
            ← Back to results
          </button>
          <h3 className="mb-1 text-xl font-extrabold text-[#111827]">
            {selected.name}
          </h3>
          <p className="mb-5 text-sm text-[#6b7280]">
            {selected.ownership_type} Institution
          </p>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-sm text-[#374151]">
              <MapPin size={14} className="text-[#4853ea]" /> {selected.state}
            </div>
            <div className="flex items-center gap-2 text-sm text-[#374151]">
              <Building2 size={14} className="text-[#4853ea]" /> Established{' '}
              {selected.year_of_establishment}
            </div>
          </div>
          {selected.website && (
            <a
              href={selected.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[#00252e] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#003a47]"
            >
              <ExternalLink size={13} /> Visit Website
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInstitutions;
