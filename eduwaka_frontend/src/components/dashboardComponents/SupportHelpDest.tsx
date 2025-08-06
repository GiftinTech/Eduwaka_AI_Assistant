import { LifeBuoy, Mail } from 'lucide-react';

const SupportHelpDesk = () => (
  <div>
    <h2 className="mb-6 text-3xl font-bold text-gray-900">Support/Help Desk</h2>
    <p className="text-gray-700">
      Need assistance? Contact our support team or browse our help articles.
    </p>
    <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <p className="mb-4">You can reach us via:</p>
      <ul className="space-y-2">
        <li className="flex items-center text-gray-700">
          <Mail size={18} className="mr-2 text-blue-500" /> Email:
          support@eduwaka.com
        </li>
        <li className="flex items-center text-gray-700">
          <LifeBuoy size={18} className="mr-2 text-blue-500" /> Live Chat
          (Coming Soon)
        </li>
      </ul>
      <p className="mt-4 text-gray-600">
        Our support team is available Monday-Friday, 9 AM - 5 PM WAT.
      </p>
    </div>
  </div>
);

export default SupportHelpDesk;
