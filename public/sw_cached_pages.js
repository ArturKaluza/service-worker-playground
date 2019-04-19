const cacheName = 'v1';

const cacheAssets = [
  'index.html',
  'about.html',
  '/css/style.css',
  '/js/main.js'
];

// Call Install Event
self.addEventListener('install', e => {
  console.log('Service Worker: Installed');

  e.waitUntil(
    caches
      .open(cacheName)
      .then(cache => {
        console.log('Service Worker: Caching Files');
        cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  );
});

// Call Activate Event
self.addEventListener('activate', e => {
  console.log('Service Worker: Activated');
  // Remove unwanted caches
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== cacheName) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Call Fetch Event
self.addEventListener('fetch', function(event) {
  // every request from our site, passes through the fetch handler
  // I have proof
  console.log('I am a request with url: ',
    event.request.clone().url);
  if (event.request.clone().method === 'GET') {
    event.respondWith(
      // check all the caches in the browser and find
      // out whether our request is in any of them
      caches.match(event.request.clone())
        .then(function(response) {
            if (response) {
              // if we are here, that means there's a match
              //return the response stored in browser
              return response;
            }
            // no match in cache, use the network instead
            return fetch(event.request.clone());
          }
        )
    );
  } else if (event.request.clone().method === 'POST') {
    // attempt to send request normally
    event.respondWith(fetch(event.request.clone()).catch(function
      (error) {
      // only save post requests in browser, if an error occurs
      savePostRequests(event.request.clone().url, form_data)
    }))
  }
});

// indexedDB
function openDatabase () {

  const indexedDBOpenRequest = indexedDB.open('POSTRequestStore',1);

  indexedDBOpenRequest.onerror = function (error) {
  // error creating db
  console.error('IndexedDB error:', error)
};

indexedDBOpenRequest.onupgradeneeded = function () {
  // execute only when database is create/update
  this.result.createObjectStore('post_requests', {
    autoIncrement:  true, keyPath: 'id' })
}
// This will execute each time the database is opened.
indexedDBOpenRequest.onsuccess = function () {
  our_db = this.result
  }
}
let our_db;

openDatabase();

self.addEventListener("message", e => {
  console.log("data from POST request ", e.data)
  if (e.data.hasOwnProperty("form_data")) {
    form_data = e.data.form_data;
  }
})


// indexedDB functions
const getObjectStore = (storeName, mode) => {
  return our_db.transaction(storeName, mode).objectStore(storeName);
};

const savePostRequests  = (url, payload) => {
  // get object_store and save our payload inside it
  console.log("save to store");
  const request = getObjectStore("testFolder", 'readewrite').add({
    url,
    payload,
    method: "POST"
  })

  request.onsuccess = e => {
    console.log("new post request has been added to indexedDB");
  }

  request.onerror = err => console.log(err);

}
