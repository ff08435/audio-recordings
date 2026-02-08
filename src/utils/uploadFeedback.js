import { supabase } from "./supabase";

export async function uploadFeedback(feedback) {
  const { error } = await supabase
    .from("feedback")
    .insert({
      participant_id: feedback.participantId,
      module_id: feedback.moduleId,
      sentence_number: feedback.sentenceNumber,
      correction: feedback.correction,
      created_at: feedback.createdAt,
    });

  if (error) {
    console.error("Feedback upload failed:", error);
    throw error;
  }
}
