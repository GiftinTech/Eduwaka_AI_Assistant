import { useEffect, useState, type ChangeEvent } from 'react';

interface Course {
  id: string;
  name: string;
  faculty: string;
  duration: string;
}

// const DJANGO_API_BASE_URL = import.meta.env.VITE_DJANGO_API_BASE_URL;

// Mock data for courses
const mockCourses: Course[] = [
  {
    id: 'medsurg',
    name: 'Medicine and Surgery',
    faculty: 'Clinical Sciences',
    duration: '6 years',
  },
  {
    id: 'compsci',
    name: 'Computer Science',
    faculty: 'Physical Sciences',
    duration: '4 years',
  },
  { id: 'law', name: 'Law', faculty: 'Law', duration: '5 years' },
  {
    id: 'masscomm',
    name: 'Mass Communication',
    faculty: 'Arts',
    duration: '4 years',
  },
  {
    id: 'civileng',
    name: 'Civil Engineering',
    faculty: 'Engineering',
    duration: '5 years',
  },
  {
    id: 'accounting',
    name: 'Accounting',
    faculty: 'Management Sciences',
    duration: '4 years',
  },
  {
    id: 'economics',
    name: 'Economics',
    faculty: 'Social Sciences',
    duration: '4 years',
  },
  {
    id: 'english',
    name: 'English Language and Literature',
    faculty: 'Arts',
    duration: '4 years',
  },
  {
    id: 'history',
    name: 'History and International Studies',
    faculty: 'Arts',
    duration: '4 years',
  },
  {
    id: 'geography',
    name: 'Geography',
    faculty: 'Social Sciences',
    duration: '4 years',
  },
];

const SearchCourses = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    // Filter courses based on search term
    if (searchTerm.trim() === '') {
      setFilteredCourses([]);
    } else {
      const lower = searchTerm.toLowerCase();
      setFilteredCourses(
        mockCourses.filter(
          (c) =>
            c.name.toLowerCase().includes(lower) ||
            c.faculty.toLowerCase().includes(lower),
        ),
      );
    }
  }, [searchTerm]);

  const handleSelectCourse = (id: string) => {
    // Temporary mock until backend is ready
    const found = mockCourses.find((c) => c.id === id);
    setSelectedCourse(
      found ?? {
        id,
        name: 'Coming Soon...',
        faculty: 'TBD',
        duration: 'N/A',
      },
    );
  };

  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold text-gray-900">
        Search for Courses
      </h2>
      <p className="text-gray-700">
        Find various courses offered by Nigerian institutions. You can search by
        course name or field of study.
      </p>
      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <input
          type="text"
          placeholder="e.g., Medicine and Surgery, Computer Science"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
        />

        {filteredCourses.length > 0 && !selectedCourse && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <h3 className="mb-3 text-lg font-semibold text-gray-800">
              Search Results:
            </h3>
            <ul className="space-y-2">
              {filteredCourses.map((course) => (
                <li
                  key={course.id}
                  className="cursor-pointer rounded-lg bg-white p-3 shadow-sm transition-colors hover:bg-gray-100"
                  onClick={() => handleSelectCourse(course.id)}
                >
                  <p className="font-medium text-gray-900">{course.name}</p>
                  <p className="text-sm text-gray-600">
                    {course.faculty} | {course.duration}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {searchTerm.trim() !== '' && filteredCourses.length === 0 && (
          <p className="mt-4 text-center text-gray-600">
            No courses found matching "{searchTerm}".
          </p>
        )}

        {/* Course details card */}
        {selectedCourse && (
          <div className="mt-6 rounded-lg border bg-white p-4 shadow">
            <h3 className="mb-2 text-lg font-bold text-blue-600">
              {selectedCourse.name}
            </h3>
            <p>
              <span className="font-medium">Faculty:</span>{' '}
              {selectedCourse.faculty}
            </p>
            <p>
              <span className="font-medium">Duration:</span>{' '}
              {selectedCourse.duration}
            </p>

            <button
              onClick={() => setSelectedCourse(null)}
              className="mt-4 rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
            >
              Back to Results
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchCourses;
