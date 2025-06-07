import { useState, useEffect, useRef } from 'react';

type ScrollDirection = 'up' | 'down';

export const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>('up');
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const thresholdPixels = useRef(10); // Threshold to determine significant scroll

  useEffect(() => {
    let ticking = false;
    
    const updateScrollDirection = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const direction: ScrollDirection = scrollY > lastScrollY.current ? 'down' : 'up';
      
      // Update direction if it changes and we've scrolled a meaningful amount
      if (Math.abs(scrollY - lastScrollY.current) > thresholdPixels.current) {
        setScrollDirection(direction);
        
        // Update visibility based on direction and position
        const shouldShow = direction === 'up' || scrollY < 100;
        setIsVisible(shouldShow);
      }
      
      lastScrollY.current = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return { scrollDirection, isVisible };
};
