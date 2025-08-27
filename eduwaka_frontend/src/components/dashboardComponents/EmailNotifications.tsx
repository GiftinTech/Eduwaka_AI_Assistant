const EmailNotifications = () => (
  <div>
    <h2 className="mb-6 text-3xl font-bold text-gray-900">
      Email Notifications/Updates on Schools
    </h2>
    <p className="text-gray-700">
      Subscribe to receive timely email updates on admission news, deadlines,
      and important announcements from your preferred institutions.
    </p>
    <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <label
        htmlFor="notificationEmail"
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        Your Email
      </label>
      <input
        type="email"
        id="notificationEmail"
        placeholder="your_email@example.com"
        className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
      />
      <button className="w-full rounded-lg bg-blue-600 py-2 text-white transition-colors hover:bg-blue-700">
        Subscribe for Updates
      </button>
      <div className="mt-4 rounded-lg border border-gray-200 bg-white p-3">
        <p className="text-gray-600">
          You will receive notifications based on your preferences.
        </p>
      </div>
      <div className="mt-4 rounded-lg border border-gray-200 bg-white p-3">
        <p className="text-gray-700">
          ℹ <span className="font-bold">Info:</span> Feature coming soon...
          This is just an MVP.
        </p>
      </div>
    </div>
  </div>
);

export default EmailNotifications;
