import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useEffect } from "react";

export default function Instructions() {
  const navigate = useNavigate();
  const { user } = useUser();

  // If no user, redirect to onboarding
  if (!user) {
    navigate("/");
    return null;
  }

  // Check if user has seen instructions before
  useEffect(() => {
    const hasSeenInstructions = localStorage.getItem("hasSeenInstructions");
    
    // If returning user, auto-skip to dashboard
    if (hasSeenInstructions === "true") {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleStart = () => {
    // Mark that user has seen instructions
    localStorage.setItem("hasSeenInstructions", "true");
    navigate("/dashboard");
  };

  const handleSkip = () => {
    // Mark that user has seen instructions (so they won't see it again)
    localStorage.setItem("hasSeenInstructions", "true");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Header with Skip Button */}
        <div className="text-center mb-8 relative">
          <button
            onClick={handleSkip}
            className="absolute right-0 top-0 text-gray-400 hover:text-yellow-400 text-sm underline transition-colors"
          >
            Skip Instructions →
          </button>
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">
            Recording Instructions
          </h1>
          <p className="text-gray-300">
            Please read carefully before you begin
          </p>
        </div>

        {/* Instructions Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 space-y-6 mb-6">
          
          {/* Step 1 */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span className="bg-yellow-400 text-black rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</span>
              Select a Section
            </h2>
            <p className="text-gray-700 pl-10">
              Each section contains multiple sentences to record. Choose a section from the dashboard to begin.
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span className="bg-yellow-400 text-black rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</span>
              Read the Burushaski Text
            </h2>
            <p className="text-gray-700 pl-10">
              You will see an <span className="text-gray-500 italic">English sentence</span> and a <span className="font-bold">Burushaski transliteration</span> (in bold).
            </p>
            <div className="pl-10 bg-gray-50 p-4 rounded-lg border-l-4 border-yellow-400">
              <p className="text-sm text-gray-500 italic mb-1">I like mangoes.</p>
              <p className="text-lg font-bold text-gray-900">Ja aam Akosh.</p>
            </div>
            <p className="text-gray-700 pl-10 font-semibold text-red-600">
              ⚠️ Read ONLY the Burushaski text (bold), NOT the English!
            </p>
          </div>

          {/* Step 3 */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span className="bg-yellow-400 text-black rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</span>
              Record Your Voice
            </h2>
            <p className="text-gray-700 pl-10">
              Click the <span className="font-semibold">Record</span> button to start recording.
            </p>
            <div className="pl-10 flex items-center gap-4">
              <div className="bg-black text-white px-4 py-2 rounded font-medium text-sm">
                🎙️ Record
              </div>
              <span className="text-gray-500">← Click this to start</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span className="bg-yellow-400 text-black rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">4</span>
              Stop Recording
            </h2>
            <p className="text-gray-700 pl-10">
              When finished speaking, click the <span className="font-semibold">Stop</span> button.
            </p>
            <div className="pl-10 flex items-center gap-4">
              <div className="bg-red-600 text-white px-4 py-2 rounded font-medium text-sm">
                ⏹️ Stop
              </div>
              <span className="text-gray-500">← Click this when done</span>
            </div>
          </div>

          {/* Step 5 */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span className="bg-yellow-400 text-black rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">5</span>
              Playback & Review
            </h2>
            <p className="text-gray-700 pl-10">
              Listen to your recording using the playback controls. If you're not satisfied, click <span className="font-semibold">Re-record</span>.
            </p>
            <div className="pl-10 space-y-2">
              <div className="bg-gray-100 p-3 rounded border border-gray-300">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>▶️</span>
                  <div className="flex-1 h-1 bg-gray-300 rounded"></div>
                  <span className="text-xs">0:03</span>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="border border-gray-400 px-3 py-1 rounded text-sm">
                  Re-record
                </div>
                <div className="bg-green-600 text-white px-3 py-1 rounded text-sm font-medium">
                  Submit
                </div>
              </div>
            </div>
          </div>

          {/* Step 6 */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span className="bg-yellow-400 text-black rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">6</span>
              Submit & Continue
            </h2>
            <p className="text-gray-700 pl-10">
              When satisfied with your recording, click <span className="font-semibold">Submit</span>. The sentence will be marked as complete, and you can move to the next one.
            </p>
          </div>

          {/* Progress Bar Info */}
          <div className="space-y-2 pt-4 border-t-2 border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
               Track Your Progress
            </h2>
            <p className="text-gray-700">
              A progress bar at the top of each section shows how many sentences you've completed.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-purple-700">3 / 10</span>
                <span>30%</span>
              </div>
              <div className="w-full bg-gray-200 rounded h-3">
                <div className="bg-green-600 rounded h-3" style={{ width: "30%" }}></div>
              </div>
            </div>
          </div>

        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4 mb-6">
          <h3 className="font-bold text-yellow-900 mb-2">⚠️ Important:</h3>
          <ul className="space-y-1 text-sm text-yellow-900">
            <li>• Read ONLY the <strong>bold Burushaski text</strong>, not the English</li>
            <li>• Speak clearly and at a natural pace</li>
            <li>• Find a quiet place to record</li>
            <li>• Each sentence can only be recorded once</li>
            <li>• Your recordings are saved automatically</li>
          </ul>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-4 rounded-xl text-lg shadow-lg transition-colors"
        >
          Start Recording →
        </button>

      </div>
    </div>
  );
}