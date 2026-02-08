import { useState } from "react";

export default function FeedbackModal({ open, onClose, onSubmit }) {
  const [sentenceNumber, setSentenceNumber] = useState("");
  const [correction, setCorrection] = useState("");

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!sentenceNumber || !correction) return;

    // Trigger the submitFeedback function passed via onSubmit prop
    onSubmit({
      sentenceNumber,
      correction,
    });

    // Reset form fields after submission
    setSentenceNumber("");
    setCorrection("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-5 w-full max-w-md space-y-3">
        <h2 className="text-lg font-bold">
          Help us improve sentence quality
        </h2>

        <p className="text-sm text-gray-600">
          Please let us know if any transliteration or translation needs to be
          corrected.  
          Write the <b>sentence number</b> and the <b>correct transliteration or translation</b>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="number"
            placeholder="Sentence number"
            value={sentenceNumber}
            onChange={(e) => setSentenceNumber(e.target.value)}
            className="w-full border rounded p-2"
            required
          />

          <textarea
            placeholder="Correct transliteration / translation"
            value={correction}
            onChange={(e) => setCorrection(e.target.value)}
            className="w-full border rounded p-2"
            rows={3}
            required
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-3 py-1 bg-green-600 text-white rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}