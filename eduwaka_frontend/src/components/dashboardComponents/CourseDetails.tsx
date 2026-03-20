import { Card, PageHeader } from './DashboardComponents';

const CourseDetails = () => (
  <div>
    <PageHeader
      title="Course Details"
      subtitle="Detailed information about courses, including duration, faculty, requirements, and career prospects."
    />
    <Card>
      <p className="text-sm italic text-[#9ca3af]">
        Select a course from 'Search Courses' to view its details here.
      </p>
    </Card>
  </div>
);
export default CourseDetails;
