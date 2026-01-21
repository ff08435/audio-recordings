export function sendReminderNotification(title, body) {
  if (Notification.permission !== "granted") return;

  new Notification(title, {
    body,
    icon: "/pwa-192x192.png",
  });
}
