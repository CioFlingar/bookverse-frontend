import { AlertCircle, X } from "lucide-react";

export default function ErrorAlert({ message, onClose, className = "" }) {
  if (!message) return null;

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 ${className}`}>
      <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
      <div className="flex-1">
        <p className="text-sm text-red-800">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-red-600 hover:text-red-700 flex-shrink-0"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}
