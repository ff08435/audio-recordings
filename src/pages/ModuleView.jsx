import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSentences } from "../hooks/useSentences";
import SentenceCard from "../Components/SentenceCard";
import { db } from "../db/indexdb";
import { useUser } from "../context/UserContext";
import ProgressBar from "../Components/ProgressBar";

export default function ModuleView() {
  const params = useParams();
  const moduleId = params?.moduleId;
  const navigate = useNavigate();
  const data = useSentences();
  const { user, loading } = useUser();
  const [completed, setCompleted] = useState([]);

  // Route guard
  if (!moduleId) {
    return (
      <div className="p-6 text-white">
        Invalid module URL
      </div>
    );
  }

  useEffect(() => {
    if (!user?.participantId) return;
    
    db.recordings
      .where({ participantId: user.participantId, moduleId })
      .toArray()
      .then((rows) =>
        setCompleted(rows.map((r) => r.sentenceId))
      )
      .catch((err) => {
        console.error("Error loading completed recordings:", err);
      });
  }, [moduleId, user?.participantId]);

  // Loading state
  if (loading || !data) {
    return (
      <div className="p-6 text-white">
        Loading...
      </div>
    );
  }

  const module = data.modules.find(
    (m) => m.moduleId === moduleId
  );

  if (!module) {
    return (
      <div className="p-6 text-white">
        Module not found
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="p-6 space-y-4">
        {/* Fixed back button with larger touch target for iOS */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm font-semibold text-yellow-400 hover:text-yellow-300 
                     -ml-2 -mt-2 py-3 px-2 min-h-[44px] min-w-[44px] relative z-50 
                     touch-manipulation active:opacity-70 transition-opacity"
          style={{ WebkitTapHighlightColor: 'transparent' }}
          aria-label="Back to Dashboard"
        >
          <span className="text-lg">←</span>
          <span>Back to Dashboard</span>
        </button>

        <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
          {module.title}
        </h1>

        <ProgressBar
          completed={completed.length}
          total={module.sentences.length}
        />

        {module.sentences.map((sentence, index) => (
          <SentenceCard
            key={sentence.sentenceId}
            sentence={sentence}
            index={index}
            moduleId={moduleId}
            isCompleted={completed.includes(sentence.sentenceId)}
            onSubmitted={(sid) =>
              setCompleted((prev) => [...prev, sid])
            }
          />
        ))}
      </div>
    </div>
  );
}