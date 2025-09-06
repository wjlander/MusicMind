// Performance optimization utilities for the wellness app
import { lazy, Suspense, memo, useMemo, useCallback, useState, useEffect } from 'react';

// Lazy loading wrapper with fallback
export const LazyComponent = (importFunc, fallback = null) => {
  const LazyComp = lazy(importFunc);
  
  return (props) => (
    <Suspense fallback={fallback || <ComponentLoader />}>
      <LazyComp {...props} />
    </Suspense>
  );
};

// Loading component for lazy-loaded components
const ComponentLoader = memo(() => (
  <div className="component-loader">
    <div className="loader-spinner" />
    <p>Loading wellness tool...</p>
    
    <style jsx>{`
      .component-loader {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
        min-height: 200px;
      }

      .loader-spinner {
        width: 32px;
        height: 32px;
        border: 3px solid #e2e8f0;
        border-top: 3px solid #4299e1;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 16px;
      }

      .component-loader p {
        color: #718096;
        font-size: 14px;
        margin: 0;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
));

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [targetRef, setTargetRef] = useState(null);

  useEffect(() => {
    if (!targetRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    observer.observe(targetRef);

    return () => {
      if (targetRef) observer.unobserve(targetRef);
    };
  }, [targetRef, options]);

  return [setTargetRef, isIntersecting];
};

// Virtualized list for large datasets
export const VirtualizedList = memo(({ items, renderItem, itemHeight = 60, containerHeight = 400 }) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const containerStyle = useMemo(() => ({
    height: containerHeight,
    overflow: 'auto',
    position: 'relative'
  }), [containerHeight]);

  const totalHeight = items.length * itemHeight;
  
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  
  const visibleItems = items.slice(startIndex, endIndex);
  
  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  return (
    <div style={containerStyle} onScroll={handleScroll}>
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${startIndex * itemHeight}px)` }}>
          {visibleItems.map((item, index) => 
            renderItem(item, startIndex + index)
          )}
        </div>
      </div>
    </div>
  );
});

// Debounced search hook
export const useDebouncedSearch = (searchTerm, delay = 300) => {
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, delay]);

  return debouncedTerm;
};

// Image optimization hook
export const useOptimizedImage = (src, options = {}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  
  const {
    placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VkZjJmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+',
    lazy = true
  } = options;

  const [currentSrc, setCurrentSrc] = useState(lazy ? placeholder : src);
  const [targetRef, isIntersecting] = useIntersectionObserver();

  useEffect(() => {
    if (!lazy || isIntersecting) {
      const img = new Image();
      img.onload = () => {
        setCurrentSrc(src);
        setIsLoaded(true);
      };
      img.onerror = () => {
        setError('Failed to load image');
      };
      img.src = src;
    }
  }, [src, lazy, isIntersecting]);

  return {
    src: currentSrc,
    isLoaded,
    error,
    ref: lazy ? targetRef : null
  };
};

// Memory optimization for large lists
export const useChunkedData = (data, chunkSize = 50) => {
  const [currentChunk, setCurrentChunk] = useState(0);
  
  const chunks = useMemo(() => {
    const result = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      result.push(data.slice(i, i + chunkSize));
    }
    return result;
  }, [data, chunkSize]);
  
  const visibleData = useMemo(() => {
    return chunks.slice(0, currentChunk + 1).flat();
  }, [chunks, currentChunk]);
  
  const loadMore = useCallback(() => {
    if (currentChunk < chunks.length - 1) {
      setCurrentChunk(prev => prev + 1);
    }
  }, [currentChunk, chunks.length]);
  
  const hasMore = currentChunk < chunks.length - 1;
  
  return {
    data: visibleData,
    loadMore,
    hasMore,
    totalChunks: chunks.length,
    currentChunk: currentChunk + 1
  };
};

// Performance monitoring hook
export const usePerformanceMonitor = (componentName) => {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > 16) { // Longer than 1 frame at 60fps
        console.warn(`${componentName} took ${renderTime.toFixed(2)}ms to render`);
      }
      
      // Log to analytics in production
      if (process.env.NODE_ENV === 'production' && renderTime > 50) {
        // Analytics.track('slow_component_render', {
        //   component: componentName,
        //   renderTime
        // });
      }
    };
  });
};

// Bundle size optimization utilities
export const loadComponentAsync = async (componentPath) => {
  try {
    const module = await import(componentPath);
    return module.default || module;
  } catch (error) {
    console.error(`Failed to load component from ${componentPath}:`, error);
    return null;
  }
};

// Local storage with caching and compression
export const useOptimizedLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      
      // Try to decompress if it looks compressed
      if (item.startsWith('compressed:')) {
        // Simple decompression placeholder
        const compressed = item.replace('compressed:', '');
        return JSON.parse(atob(compressed));
      }
      
      return JSON.parse(item);
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return defaultValue;
    }
  });

  const setOptimizedValue = useCallback((newValue) => {
    try {
      setValue(newValue);
      
      const serialized = JSON.stringify(newValue);
      
      // Compress if the data is large (>1KB)
      if (serialized.length > 1024) {
        const compressed = 'compressed:' + btoa(serialized);
        localStorage.setItem(key, compressed);
      } else {
        localStorage.setItem(key, serialized);
      }
    } catch (error) {
      console.error(`Error setting ${key} in localStorage:`, error);
    }
  }, [key]);

  return [value, setOptimizedValue];
};

// Component preloading utilities
export const preloadComponents = (...componentPaths) => {
  componentPaths.forEach(path => {
    // Start loading components in the background
    import(path).catch(error => {
      console.warn(`Failed to preload component ${path}:`, error);
    });
  });
};

// Service worker registration with updates
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        newWorker?.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New version available
            if (confirm('A new version of the wellness app is available. Update now?')) {
              newWorker.postMessage({ type: 'SKIP_WAITING' });
              window.location.reload();
            }
          }
        });
      });
      
      // Listen for controlling service worker changes
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
      
      console.log('Service Worker registered successfully');
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

// Offline data sync utilities
export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSync, setPendingSync] = useState(0);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const queueDataForSync = useCallback(async (type, data) => {
    if (isOnline) {
      // Save immediately if online
      const existingData = JSON.parse(localStorage.getItem(type) || '[]');
      existingData.push(data);
      localStorage.setItem(type, JSON.stringify(existingData));
      return;
    }

    // Queue for sync when back online
    try {
      const request = indexedDB.open('WellnessOfflineDB', 1);
      
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['pendingSync'], 'readwrite');
        const store = transaction.objectStore('pendingSync');
        
        store.add({
          type,
          data,
          timestamp: Date.now()
        });
        
        setPendingSync(prev => prev + 1);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('pendingSync')) {
          db.createObjectStore('pendingSync', { keyPath: 'id', autoIncrement: true });
        }
      };
    } catch (error) {
      console.error('Failed to queue data for sync:', error);
    }
  }, [isOnline]);

  return {
    isOnline,
    pendingSync,
    queueDataForSync
  };
};

export default {
  LazyComponent,
  useIntersectionObserver,
  VirtualizedList,
  useDebouncedSearch,
  useOptimizedImage,
  useChunkedData,
  usePerformanceMonitor,
  loadComponentAsync,
  useOptimizedLocalStorage,
  preloadComponents,
  registerServiceWorker,
  useOfflineSync
};