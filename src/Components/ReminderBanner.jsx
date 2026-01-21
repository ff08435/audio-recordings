export default function ReminderBanner({ message }) {
  if (!message) return null;

  return (
    <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-3 rounded">
      {message}
    </div>
  );
}
