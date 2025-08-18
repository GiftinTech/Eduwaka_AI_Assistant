import { useAlert } from '../hooks/useAlert';

const AlertContainer = () => {
  const { alert, hideAlert } = useAlert();

  if (!alert) return null;

  const alertClasses = {
    success: 'bg-green-100 text-green-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  };

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 rounded-lg p-4 shadow-lg ${alertClasses[alert.type]}`}
      role="alert"
    >
      <div className="flex items-center">
        <span>{alert.message}</span>
        <button
          onClick={hideAlert}
          className="ml-auto text-current opacity-75 hover:opacity-100"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default AlertContainer;
