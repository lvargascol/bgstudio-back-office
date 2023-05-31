import { XCircleIcon } from '@heroicons/react/24/solid';

const Alert = ({ alert, handleClose }) => {

  const alertStyle = () => {
    if (alert.type === 'success') {
      return 'bg-green-100 p-5 w-full rounded mb-8';
    } else if (alert.type === 'error') {
      return 'bg-red-100 p-5 w-full rounded mb-8';
    }
  }

  return (
    <>{alert?.active && (
      <div x-data className={alertStyle()}>
        <div className="flex space-x-3">
          <div className="flex-1 leading-tight text-sm text-black font-medium">{alert.message}</div>
          <button type="button">
            <XCircleIcon className="w-6 h-6 text-gray-600" onClick={handleClose} />
          </button>
        </div>
      </div>
    )}
    </>
  );
};

export default Alert;