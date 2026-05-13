export default function ProgressBar({ progress = 0, showLabel = true, className = '' }) {
  return (
    <div className={`w-full ${className}`}>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-slate-800 h-full transition-all duration-300"
          style={{ width: `${Math.min(progress, 100)}%` }}
        ></div>
      </div>
      {showLabel && (
        <p className="text-xs text-gray-600 mt-1">
          {Math.round(progress)}% Complete
        </p>
      )}
    </div>
  );
}
