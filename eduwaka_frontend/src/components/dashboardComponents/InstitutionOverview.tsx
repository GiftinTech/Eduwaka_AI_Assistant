const InstitutionOverview = () => (
  <div>
    <h2 className="mb-6 text-3xl font-bold text-gray-900">
      Institution Overview ("Know Your Institution")
    </h2>
    <p className="text-gray-700">
      Get a comprehensive overview of Nigerian universities, including history,
      faculties, notable alumni and campus life.
    </p>
    <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <label
        htmlFor="institutionOverview"
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        Institution Name
      </label>
      <input
        type="text"
        id="institutionOverview"
        placeholder="e.g., Obafemi Awolowo University"
        className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
        // You might want to add state and onChange handler here if this input is interactive
      />
      <button className="w-full rounded-lg bg-blue-600 py-2 text-white transition-colors hover:bg-blue-700">
        Get Overview
      </button>
      <div className="mt-4 rounded-lg border border-gray-200 bg-white p-3">
        <p className="text-gray-600">
          Detailed institution information will appear here.
        </p>
      </div>
    </div>
  </div>
);

export default InstitutionOverview;
