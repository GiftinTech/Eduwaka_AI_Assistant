import { useEffect, useState, type ChangeEvent } from 'react';

interface Course {
  id: string;
  name: string;
  faculty: string;
  duration: string;
}

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

  useEffect(() => {
    // Filter courses based on search term
    if (searchTerm.trim() === '') {
      setFilteredCourses([]);
    } else {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const results = mockCourses.filter(
        (course) =>
          course.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          course.faculty.toLowerCase().includes(lowerCaseSearchTerm),
      );
      setFilteredCourses(results);
    }
  }, [searchTerm]);

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
        {filteredCourses.length > 0 && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <h3 className="mb-3 text-lg font-semibold text-gray-800">
              Search Results:
            </h3>
            <ul className="space-y-2">
              {filteredCourses.map((course) => (
                <li
                  key={course.id}
                  className="rounded-lg bg-white p-3 shadow-sm transition-colors hover:bg-gray-100"
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
      </div>
    </div>
  );
};

export default SearchCourses;
