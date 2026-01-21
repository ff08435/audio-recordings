export default function ProgressBar({ completed, total, small = false }) {
  const percentage =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className={small ? "space-y-1" : "space-y-2"}>
      <div className={`flex justify-between ${small ? "text-xs" : "text-sm"} font-medium`}>
        <span className="text-purple-700">
          {completed} / {total}
        </span>
        <span>{percentage}%</span>
      </div>

      <div className={`w-full bg-gray-200 rounded ${small ? "h-2" : "h-3"}`}>
        <div
          className={`bg-green-600 rounded ${small ? "h-2" : "h-3"} transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
