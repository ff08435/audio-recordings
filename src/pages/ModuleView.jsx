import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSentences } from "../hooks/useSentences";
import SentenceCard from "../Components/SentenceCard";
import { db } from "../db/indexdb";
import { useUser } from "../context/UserContext";
import ProgressBar from "../Components/ProgressBar";
import FeedbackModal from "../Components/FeedbackModal";
import { uploadFeedback } from "../utils/uploadFeedback";  // Importing the uploadFeedback function

export default function ModuleView() {
  const params = useParams();
  const moduleId = params?.moduleId;
  const navigate = useNavigate();
  const data = useSentences();
  const { user, loading } = useUser();
  const [completed, setCompleted] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);

  // Route guard (check if moduleId exists)
  if (!moduleId) {
    return (
      <div className="p-6 text-white">
        Invalid module URL
      </div>
    );
  }

  // Fetching completed recordings from IndexedDB
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

  // Function to submit feedback
  const submitFeedback = async ({ sentenceNumber, correction }) => {
    // Save feedback in IndexedDB
    await db.feedback.add({
      participantId: user.participantId,
      moduleId,
      sentenceNumber: Number(sentenceNumber),
      correction,
      status: "pending", // Mark as pending until synced
      createdAt: new Date(),
    });

    // If the user is online, sync feedback to Supabase
    if (navigator.onLine) {
      // Call the function to upload feedback to Supabase
      await uploadFeedback({
        participantId: user.participantId,
        moduleId,
        sentenceNumber,
        correction,
        createdAt: new Date(),
      });
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="p-6 space-y-4">
        {/* Large, easy-to-tap back button for mobile */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center justify-center gap-3 w-full
                     bg-yellow-400/10 hover:bg-yellow-400/20 
                     text-yellow-400 font-bold text-base
                     py-4 px-6 rounded-xl
                     border-2 border-yellow-400/30
                     relative z-50 
                     touch-manipulation active:scale-95 
                     transition-all duration-200 shadow-lg"
          style={{ 
            WebkitTapHighlightColor: 'transparent',
            minHeight: '56px',
            touchAction: 'manipulation'
          }}
          aria-label="Back to Dashboard"
        >
          <span className="text-2xl">←</span>
          <span>Back to Dashboard</span>
        </button>

        {/* Report a correction button */}
        <button
          onClick={() => setShowFeedback(true)}
          className="w-full border border-blue-300 text-blue-600 
                     rounded-xl py-3 font-semibold
                     bg-blue-50 hover:bg-blue-100"
        >
          Report a correction
        </button>

        <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
          {module.title}
        </h1>

        {/* Progress Bar */}
        <ProgressBar
          completed={completed.length}
          total={module.sentences.length}
        />

        {/* Render each sentence with its SentenceCard */}
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

      {/* Feedback Modal */}
      <FeedbackModal
        open={showFeedback}
        onClose={() => setShowFeedback(false)}
        onSubmit={submitFeedback}
      />
    </div>
  );
}
