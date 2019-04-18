// Make sure sw are supported
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('../sw_cached_pages.js')
      .then(reg => console.log('Service Worker: Registered (Pages)'))
      .catch(err => console.log(`Service Worker: Error: ${err}`));
  });
}

const form = document.querySelector('form').addEventListener("submit", e => {
  e.preventDefault();
  const fname = e.target.fname.value;
  const lname = e.target.lname.value;

  fetch("/test", {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({fname, lname})
  })

})
