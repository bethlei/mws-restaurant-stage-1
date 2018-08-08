/**
 * Set up service worker.
 */
registerServiceWorker = () => {
  if(!navigator.serviceWorker) return;

  navigator.serviceWorker.register('/sw.js')
    .then(() => navigator.serviceWorker.ready)
    .then(reg => {
      reg.sync.register('pending-reviews')
    }).then(() => console.log('Sync registered'))
    .catch((err) => console.log('Sync registration failed: ', err));
}

registerServiceWorker();