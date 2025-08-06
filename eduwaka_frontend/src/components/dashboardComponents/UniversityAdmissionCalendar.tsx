import { Calendar } from 'lucide-react';

const UniversityAdmissionCalendar = () => (
  <div>
    <h2 className="mb-6 text-3xl font-bold text-gray-900">
      University Admission Calendar
    </h2>
    <p className="text-gray-700">
      Stay updated with important dates for JAMB, Post-UTME and admission
      deadlines across various institutions.
    </p>
    <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <p className="text-gray-600">
        Calendar events will be displayed here, showing key admission dates.
      </p>
      <ul className="mt-4 space-y-2">
        <li className="flex items-center text-gray-700">
          <Calendar size={18} className="mr-2 text-blue-500" /> JAMB
          Registration: Dates TBD
        </li>
        <li className="flex items-center text-gray-700">
          <Calendar size={18} className="mr-2 text-blue-500" /> Post-UTME
          Screening: Varies by institution
        </li>
        <li className="flex items-center text-gray-700">
          <Calendar size={18} className="mr-2 text-blue-500" /> Admission List
          Release: Varies by institution
        </li>
      </ul>
    </div>
  </div>
);

export default UniversityAdmissionCalendar;
