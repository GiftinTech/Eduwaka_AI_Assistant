import { LifeBuoy, Mail } from 'lucide-react';
import { Card, PageHeader, SectionLabel } from './DashboardComponents';

const SupportHelpDesk = () => (
  <div>
    <PageHeader
      title="Support / Help Desk"
      subtitle="Need assistance? Contact our support team or browse our help articles."
    />
    <Card>
      <SectionLabel>Contact Us</SectionLabel>
      <ul className="space-y-3">
        <li className="flex items-center gap-3 rounded-xl border border-[#e5e7eb] px-4 py-3 text-sm text-[#111827]">
          <Mail size={15} className="text-[#eb4799]" />
          support@eduwaka.com
        </li>
        <li className="flex items-center gap-3 rounded-xl border border-[#e5e7eb] px-4 py-3 text-sm text-[#6b7280]">
          <LifeBuoy size={15} className="text-[#4853ea]" />
          Live Chat — Coming Soon
        </li>
      </ul>
      <p className="mt-4 text-sm text-[#6b7280]">
        Our support team is available Monday – Friday, 9 AM – 5 PM WAT.
      </p>
    </Card>
  </div>
);
export default SupportHelpDesk;
