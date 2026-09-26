/* Register the site service worker on HTTPS only. Does not touch waitlist data. */
if ("serviceWorker" in navigator && location.protocol === "https:") {
  navigator.serviceWorker.register("/sw.js");
}
