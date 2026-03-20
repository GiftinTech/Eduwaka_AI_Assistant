import { Calendar } from 'lucide-react';

import {
  PageHeader,
  Card,
  InfoBanner,
  SectionLabel,
} from './DashboardComponents';
const UniversityAdmissionCalendar = () => (
  <div>
    <PageHeader
      title="Admission Calendar"
      subtitle="Stay updated with important dates for JAMB, Post-UTME and admission deadlines."
      badge="2025/2026 Session"
    />
    <Card>
      <SectionLabel>Key Dates</SectionLabel>
      <ul className="space-y-3">
        {[
          { label: 'JAMB Registration', value: 'Dates TBD' },
          { label: 'Post-UTME Screening', value: 'Varies by institution' },
          { label: 'Admission List Release', value: 'Varies by institution' },
        ].map((item) => (
          <li
            key={item.label}
            className="flex items-center justify-between rounded-xl border border-[#e5e7eb] px-4 py-3"
          >
            <span className="flex items-center gap-3 text-sm font-medium text-[#111827]">
              <Calendar size={15} className="text-[#4853ea]" />
              {item.label}
            </span>
            <span className="rounded-full bg-[#f3f4f6] px-3 py-1 text-xs text-[#6b7280]">
              {item.value}
            </span>
          </li>
        ))}
      </ul>
      <InfoBanner>
        More details will be covered soon. This is just an MVP.
      </InfoBanner>
    </Card>
  </div>
);
export default UniversityAdmissionCalendar;
