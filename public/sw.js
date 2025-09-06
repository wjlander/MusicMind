// Wellness App Service Worker for Offline Capability
const CACHE_NAME = 'wellness-app-v1';
const OFFLINE_URL = '/offline.html';

// Core files to cache for offline functionality
const CORE_CACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html'
];

// Wellness tools that work offline
const WELLNESS_CACHE_PATTERNS = [
  '/src/components/MoodTracker.jsx',
  '/src/components/BreathingGame.jsx',
  '/src/components/MeditationTimer.jsx',
  '/src/components/GratitudeGame.jsx',
  '/src/components/ProgressiveMuscleRelaxation.jsx',
  '/src/components/GroundingTechniques.jsx',
  '/src/components/EmergencyCopingToolkit.jsx',
  '/src/services/wellnessDataService.js'
];

// Install event - cache core resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker for wellness app');
  
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      console.log('[SW] Caching core app shell');
      await cache.addAll(CORE_CACHE_URLS);
    })()
  );
  
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker');
  
  event.waitUntil(
    (async () => {
      // Clean up old caches
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })()
  );
  
  // Take control of all clients
  self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return;
  
  event.respondWith(
    (async () => {
      try {
        // Try network first for dynamic content
        if (event.request.url.includes('/api/') || event.request.url.includes('spotify')) {
          const networkResponse = await fetch(event.request);
          return networkResponse;
        }
        
        // For static resources, try cache first
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          console.log('[SW] Serving from cache:', event.request.url);
          return cachedResponse;
        }
        
        // Try network
        const networkResponse = await fetch(event.request);
        
        // Cache wellness-related resources
        if (shouldCache(event.request.url)) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, networkResponse.clone());
        }
        
        return networkResponse;
        
      } catch (error) {
        console.log('[SW] Network failed, trying cache:', event.request.url);
        
        // Try cache as fallback
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Return offline page for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
        
        // Return basic offline response
        return new Response('Offline - this feature requires an internet connection', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/plain' }
        });
      }
    })()
  );
});

// Helper function to determine if a resource should be cached
function shouldCache(url) {
  // Cache wellness components and services
  return WELLNESS_CACHE_PATTERNS.some(pattern => url.includes(pattern)) ||
         url.includes('/wellness/') ||
         url.includes('components/') ||
         url.includes('services/') ||
         url.endsWith('.js') ||
         url.endsWith('.css') ||
         url.endsWith('.html');
}

// Background sync for wellness data
self.addEventListener('sync', (event) => {
  if (event.tag === 'wellness-data-sync') {
    event.waitUntil(syncWellnessData());
  }
});

async function syncWellnessData() {
  console.log('[SW] Syncing wellness data in background');
  
  try {
    // Get pending sync data from IndexedDB
    const pendingData = await getPendingSyncData();
    
    if (pendingData.length === 0) {
      console.log('[SW] No pending data to sync');
      return;
    }
    
    // Process each pending item
    for (const item of pendingData) {
      try {
        // Save to localStorage (simulating server sync)
        const existingData = JSON.parse(localStorage.getItem(item.type) || '[]');
        existingData.push(item.data);
        localStorage.setItem(item.type, JSON.stringify(existingData));
        
        // Remove from pending sync
        await removePendingSyncData(item.id);
        console.log('[SW] Synced wellness data item:', item.type);
      } catch (error) {
        console.error('[SW] Failed to sync item:', item, error);
      }
    }
    
    // Notify clients about successful sync
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'WELLNESS_DATA_SYNCED',
        count: pendingData.length
      });
    });
    
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// IndexedDB helpers for offline data storage
async function getPendingSyncData() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('WellnessOfflineDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['pendingSync'], 'readonly');
      const store = transaction.objectStore('pendingSync');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => resolve(getAllRequest.result || []);
      getAllRequest.onerror = () => resolve([]);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pendingSync')) {
        db.createObjectStore('pendingSync', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

async function removePendingSyncData(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('WellnessOfflineDB', 1);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['pendingSync'], 'readwrite');
      const store = transaction.objectStore('pendingSync');
      const deleteRequest = store.delete(id);
      
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
  });
}

// Listen for messages from the main app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_WELLNESS_DATA') {
    // Cache wellness data for offline access
    cacheWellnessData(event.data.payload);
  }
});

async function cacheWellnessData(data) {
  try {
    const cache = await caches.open(CACHE_NAME + '-data');
    const response = new Response(JSON.stringify(data));
    await cache.put('/wellness-data-cache', response);
    console.log('[SW] Cached wellness data for offline access');
  } catch (error) {
    console.error('[SW] Failed to cache wellness data:', error);
  }
}