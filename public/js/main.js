// Make sure sw are supported
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker
//       .register('./sw.js')
//       .then(reg => console.log('Service Worker: Registered (Pages)'))
//       .catch(err => console.log(`Service Worker: Error: ${err}`));
//   });
// }
if ('serviceWorker' in navigator) {
  // we are checking here to see if the browser supports the service worker api
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      // Registration was successful
      console.log('Service Worker registration was successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });

    navigator.serviceWorker.ready.then(function(registration) {
      console.log('Service Worker Ready')
      return registration.sync.register('sendFormData')
    }).then(function () {
      console.log('sync event registered')
    }).catch(function() {
      // system was unable to register for a sync,
      // this could be an OS-level restriction
      console.log('sync registration failed')
    });
  });


}



const form = document.querySelector('form').addEventListener("submit", e => {
  e.preventDefault();
  const msg = {
    fname: e.target.fname.value,
    lname: e.target.lname.value
  }
  // send message to service worker via postMessage
  navigator.serviceWorker.controller.postMessage(msg);

  fetch("/test", {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify(msg)
  })
})

