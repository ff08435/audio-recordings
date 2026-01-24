// ONBOARDING.JSX
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { subscribeToPush } from "../hooks/usePushNotifications";

export default function Onboarding() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const [participantId, setParticipantId] = useState("");
  const [dialect, setDialect] = useState("");
  const [gender, setGender] = useState("");
  const [locked, setLocked] = useState(false);

  // 🔥 AUTO-FILL ON LOAD
  useEffect(() => {
    if (user) {
      setParticipantId(user.participantId);
      setDialect(user.dialect);
      setGender(user.gender);
      setLocked(true); // lock fields to avoid mistakes
    }
  }, [user]);

  const submit = async () => {
    if (!participantId || !dialect || !gender) return;

    const userData = { participantId, dialect, gender };

    if (Notification.permission === "granted") {
      await subscribeToPush(userData);
    }

    setUser(userData);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl bg-gradient-to-b from-neutral-900 to-neutral-950 p-6 shadow-2xl border border-neutral-800 space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-yellow-400">
            Welcome
          </h1>
          <p className="text-sm text-gray-400">
            Help us record Burushaski sentences
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">

          {/* Participant ID */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Participant ID</label>
            <input
              className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2 text-sm text-white disabled:opacity-60"
              placeholder="e.g. P-023"
              value={participantId}
              disabled={locked}
              onChange={(e) => setParticipantId(e.target.value)}
            />
          </div>

          {/* Dialect */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Dialect</label>
            <select
              className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2 text-sm text-white disabled:opacity-60"
              value={dialect}
              disabled={locked}
              onChange={(e) => setDialect(e.target.value)}
            >
              <option value="">Select dialect</option>
              <option value="yasin">Yasin</option>
              <option value="hunza">Hunza</option>
            </select>
          </div>

          {/* Gender */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Gender</label>
            <select
              className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2 text-sm text-white disabled:opacity-60"
              value={gender}
              disabled={locked}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={submit}
          disabled={!participantId || !dialect || !gender}
          className="w-full rounded-lg bg-yellow-400 py-2 text-sm font-semibold text-black hover:bg-yellow-300 disabled:opacity-40"
        >
          Continue
        </button>

        {/* Optional reset */}
        {locked && (
          <button
            onClick={() => {
              localStorage.removeItem("burushaski_user");
              setLocked(false);
              setParticipantId("");
              setDialect("");
              setGender("");
            }}
            className="w-full text-xs text-red-400 underline"
          >
            Reset participant details
          </button>
        )}

        <p className="text-center text-xs text-gray-500">
          Your data is anonymous and used only for research.
        </p>
      </div>
    </div>
  );
}
