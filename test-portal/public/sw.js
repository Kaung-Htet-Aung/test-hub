const CACHE_NAME = 'exam-app-v1';
const API_CACHE_NAME = 'exam-api-v1';

// Files to cache for app shell
const urlsToCache = [
  /* '/exam', */
  /* '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.ico' */
];

// Install event - cache app shell
/* self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
}); */

// Activate event - clean up old caches
/* self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}); */

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clone the response since it can only be consumed once
          const responseToCache = response.clone();
          
          // Cache successful API responses
          if (response.status === 200) {
            caches.open(API_CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
          }
          
          return response;
        })
        .catch(() => {
          // If offline, try to serve from cache
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // Handle non-API requests
  /* event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request since it can only be used once
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(
          response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response since it can only be consumed once
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          }
        );
      })
  ); */
});

// Background sync
self.addEventListener('sync', event => {
  if (event.tag === 'sync-answers') {
    event.waitUntil(syncAnswers());
  }
});

// Sync answers with server
async function syncAnswers() {
  try {
    // Get all unsynced answers from IndexedDB
    const unsyncedAnswers = await getUnsyncedAnswersFromDB();
    
    // Sync each answer
    for (const answer of unsyncedAnswers) {
      try {
        const response = await fetch(`/api/exams/${answer.examId}/answers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(answer),
        });
        
        if (response.ok) {
          // Mark as synced in IndexedDB
          await markAnswerAsSynced(answer.id);
        }
      } catch (error) {
        console.error('Failed to sync answer:', answer.id, error);
      }
    }
  } catch (error) {
    console.error('Failed to sync answers:', error);
  }
}

// Mock IndexedDB functions (in real app, use Dexie.js)
async function getUnsyncedAnswersFromDB() {
  // Mock implementation - in real app, query IndexedDB
  return [];
}

async function markAnswerAsSynced(answerId) {
  // Mock implementation - in real app, update IndexedDB
  console.log('Marking answer as synced:', answerId);
}

// Push notifications (optional)
self.addEventListener('push', event => {
  const options = {
    body: event.data.text(),
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('Exam App', options)
  );
});