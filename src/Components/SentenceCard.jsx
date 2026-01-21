import { useRecorder } from "../hooks/useRecorder";
import { db } from "../db/indexdb";
import { useUser } from "../context/UserContext";
import { useEffect, useState } from "react";
import { syncPendingRecordings } from "../utils/syncRecordings"; // ✅ FIX #1

export default function SentenceCard({
  sentence,
  index,
  moduleId,
  isCompleted,
  onSubmitted,
}) {
  const { user } = useUser();

  const {
    isRecording,
    startRecording,
    stopRecording,
    resetRecording,
  } = useRecorder();

  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [status, setStatus] = useState(null); // pending | synced

  /**
   * ✅ IMPORTANT:
   * A sentence is considered "recorded" once it exists in IndexedDB,
   * NOT only when it is synced.
   */
  const isRecorded = isCompleted;

  // 🔁 FIX #3: Always re-read status from IndexedDB
  useEffect(() => {
    const load = async () => {
      const record = await db.recordings
        .where({
          participantId: user.participantId,
          moduleId,
          sentenceId: sentence.sentenceId,
        })
        .last();

      if (record?.status) {
        setStatus(record.status);
      }
    };

    load();
  }, [moduleId, sentence.sentenceId, user.participantId]);

  const handleStart = async () => {
    await startRecording();
  };

  const handleStop = async () => {
    const blob = await stopRecording();
    if (blob) {
      setAudioBlob(blob);
      setAudioUrl(URL.createObjectURL(blob));
    }
  };

  const handleReset = () => {
    resetRecording();
    setAudioBlob(null);
    setAudioUrl(null);
  };

  // ✅ FIX #1: Trigger sync after every submit
  const submit = async () => {
    if (!audioBlob || isRecorded) return;

    await db.recordings.add({
      participantId: user.participantId,
      dialect: user.dialect,
      moduleId,
      sentenceId: sentence.sentenceId,
      audioBlob,
      status: "pending",
      createdAt: new Date(),
    });

    setStatus("pending");
    onSubmitted(sentence.sentenceId);

    // 🚀 FORCE SYNC IF ONLINE
    if (navigator.onLine) {
      syncPendingRecordings(user);
    }
  };

  return (
    <div
      className={`border p-4 rounded space-y-2 transition ${
        isRecorded
          ? "bg-gray-100 opacity-60 pointer-events-none"
          : "bg-white"
      }`}
    >
      <p className="font-semibold">
        {index + 1}. {sentence.english}
      </p>

      <p className="italic text-gray-600">
        {sentence.transliteration}
      </p>

      {/* 🎙 Recording */}
      {!isRecorded && !audioUrl && (
        <div className="space-x-2">
          {!isRecording ? (
            <button
              onClick={handleStart}
              className="px-3 py-1 bg-black text-white rounded"
            >
              Record
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="px-3 py-1 bg-red-600 text-white rounded"
            >
              Stop
            </button>
          )}
        </div>
      )}

      // 🎧 Playback
{!isRecorded && audioUrl && (
  <div className="space-y-2">
    <audio
      controls
      src={audioUrl}
      onPlay={() => {
        // Explicitly log to confirm user trigger
        console.log("Audio playback triggered");
      }}
    />
    <div className="space-x-2">
      <button
        onClick={handleReset}
        className="px-3 py-1 border rounded"
      >
        Re-record
      </button>

      <button
        onClick={submit}
        className="px-3 py-1 bg-green-600 text-white rounded"
      >
        Submit
      </button>
    </div>
  </div>
)}


      {/* ✅ Completed status */}
      {isRecorded && (
        <>
          <p className="text-green-700 font-semibold">
            ✓ Submitted
          </p>

          {status === "pending" && (
            <span className="text-xs text-yellow-600 block">
              Saved offline • Will upload later
            </span>
          )}

          {status === "synced" && (
            <span className="text-xs text-green-600 block">
              Uploaded successfully
            </span>
          )}
        </>
      )}
    </div>
  );
}
