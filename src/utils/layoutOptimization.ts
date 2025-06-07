/**
 * Layout Optimization Utilities
 * 
 * This module provides utilities to minimize layout shifts and improve
 * cumulative layout shift (CLS) scores.
 */

// Layout shift prevention utilities
export const layoutOptimization = {
  
  /**
   * Pre-allocate space for dynamic content to prevent layout shifts
   */
  preAllocateSpace: (element: HTMLElement, minHeight: number) => {
    if (!element.style.minHeight) {
      element.style.minHeight = `${minHeight}px`;
    }
  },
  
  /**
   * Set up image loading to prevent layout shifts
   */
  optimizeImageLoading: (img: HTMLImageElement) => {
    // Set loading="lazy" for images below the fold
    if (!img.hasAttribute('loading')) {
      const rect = img.getBoundingClientRect();
      if (rect.top > window.innerHeight) {
        img.loading = 'lazy';
      }
    }
    
    // Pre-allocate space based on aspect ratio if known
    if (img.dataset.aspectRatio) {
      const aspectRatio = parseFloat(img.dataset.aspectRatio);
      if (!isNaN(aspectRatio)) {
        img.style.aspectRatio = aspectRatio.toString();
      }
    }
  },
  
  /**
   * Batch DOM operations to minimize layout thrashing
   */
  batchDOMOperations: (operations: (() => void)[]) => {
    requestAnimationFrame(() => {
      operations.forEach(op => op());
    });
  },
  
  /**
   * Optimize font loading to prevent layout shifts
   */
  optimizeFontLoading: () => {
    // Use font-display: swap for better loading performance
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
  },
  
  /**
   * Monitor and log significant layout shifts for debugging
   */
  monitorLayoutShifts: (threshold: number = 0.1) => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift') {
            const layoutShift = entry as PerformanceEntry & { value: number };
            if (layoutShift.value > threshold) {
              console.group('🏗️ Layout Shift Detected');
              console.log('Shift value:', layoutShift.value.toFixed(3));
              console.log('Start time:', layoutShift.startTime.toFixed(2), 'ms');
              console.log('Sources:', (layoutShift as PerformanceEntry & { value: number; sources?: unknown[] }).sources);
              console.groupEnd();
            }
          }
        }
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
      return observer;
    }
    
    return null;
  },
  
  /**
   * Provide size hints for dynamic content containers
   */
  setSizeHints: (element: HTMLElement, options: {
    width?: number;
    height?: number;
    aspectRatio?: number;
  }) => {
    if (options.width) {
      element.style.width = `${options.width}px`;
    }
    
    if (options.height) {
      element.style.height = `${options.height}px`;
    }
    
    if (options.aspectRatio) {
      element.style.aspectRatio = options.aspectRatio.toString();
    }
  },
  
  /**
   * Initialize layout optimization for the entire page
   */
  initializePageOptimizations: () => {
    // Optimize font loading
    layoutOptimization.optimizeFontLoading();
    
    // Pre-allocate space for common dynamic elements
    const dynamicContainers = document.querySelectorAll('[data-dynamic]');
    dynamicContainers.forEach((container) => {
      const minHeight = parseInt(container.getAttribute('data-min-height') || '100');
      layoutOptimization.preAllocateSpace(container as HTMLElement, minHeight);
    });
    
    // Optimize all images
    const images = document.querySelectorAll('img');
    images.forEach(img => layoutOptimization.optimizeImageLoading(img));
    
    // Set up a more tolerant layout shift monitor (only for very large shifts)
    const observer = layoutOptimization.monitorLayoutShifts(0.25);
    
    console.log('🎯 Layout optimization initialized');
    
    return observer;
  }
};

// Auto-initialize on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      layoutOptimization.initializePageOptimizations();
    });
  } else {
    layoutOptimization.initializePageOptimizations();
  }
}

export default layoutOptimization;
