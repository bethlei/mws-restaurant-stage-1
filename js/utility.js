/**
 * Set up service worker.
 */
registerServiceWorker = () => {
  if(!navigator.serviceWorker) return;

  navigator.serviceWorker.register('/sw.js')
    .then((reg) => console.log(reg))
    .catch((err) => console.log(err));
}

registerServiceWorker();