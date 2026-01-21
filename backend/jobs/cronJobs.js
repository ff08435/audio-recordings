// backend/jobs/cronJobs.js
import cron from "node-cron";

export function startCronJobs(supabase) {
  console.log("⏰ Starting cron jobs...\n");

  // ============================================
  // DAILY REMINDER AT 9:00 AM
  // ============================================
  // Cron syntax: "minute hour day month day-of-week"
  // "0 9 * * *" = Every day at 9:00 AM
  cron.schedule("0 9 * * *", async () => {
    console.log("\n");
    console.log("╔════════════════════════════════════╗");
    console.log("║  ⏰ DAILY REMINDER CRON TRIGGERED  ║");
    console.log("║  Time: 9:00 AM                     ║");
    console.log(`║  ${new Date().toLocaleString()}  ║`);
    console.log("╚════════════════════════════════════╝");
    console.log("\n");

    try {
      // Get all subscribed users
      const { data: users, error } = await supabase
        .from("push_subscriptions")
        .select("participant_id");

      if (error) throw error;

      const participantIds = users.map((u) => u.participant_id);

      if (participantIds.length === 0) {
        console.log("⚠️  No subscribed users found");
        return;
      }

      console.log(`📢 Sending reminders to ${participantIds.length} user(s)...`);

      // Send reminder via the API endpoint
      const response = await fetch("http://localhost:3001/api/send-reminder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          participantIds: [], // Empty = send to all
          title: "🎤 Time to Record Burushaski!",
          body: "You have sentences waiting to be recorded. Help preserve the language!",
        }),
      });

      const result = await response.json();

      console.log("✅ Cron job completed");
      console.log(`   Sent: ${result.sent}`);
      console.log(`   Failed: ${result.failed}`);
      console.log(`   Total: ${result.total}\n`);
    } catch (error) {
      console.error("❌ Cron job failed:", error.message);
      console.error(error);
    }
  });

  console.log("✅ Cron jobs initialized");
  console.log("   Daily reminder scheduled for 9:00 AM daily\n");
}