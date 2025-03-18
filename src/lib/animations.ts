
import { useEffect, useState, useRef } from 'react';

// Hook for triggering animations when element is in viewport
export const useInViewAnimation = (options = {}) => {
  const [isInView, setIsInView] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        }
      },
      { threshold: 0.2, ...options }
    );
    
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    
    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [options]);
  
  return { elementRef, isInView, setElementRef: (el: HTMLElement | null) => { elementRef.current = el; } };
};

// Hook for smooth number counting animation
export const useCountAnimation = (endValue: number, duration: number = 1500) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(progress * endValue);
      
      setCount(value);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [endValue, duration]);
  
  return count;
};

// Utility to create spring-based animations
export const createSpringAnimation = (
  element: HTMLElement, 
  properties: { [key: string]: number }, 
  options = { stiffness: 100, damping: 10 }
) => {
  type Spring = { 
    target: number; 
    current: number; 
    velocity: number;
  };
  
  const springs: { [key: string]: Spring } = {};
  
  // Initialize springs for each property
  Object.keys(properties).forEach(prop => {
    const currentValue = parseFloat(window.getComputedStyle(element)[prop as any] as string) || 0;
    springs[prop] = {
      target: properties[prop],
      current: currentValue,
      velocity: 0
    };
  });
  
  // Animation frame
  let animationFrameId: number;
  
  const animate = () => {
    let stillAnimating = false;
    
    Object.keys(springs).forEach(prop => {
      const spring = springs[prop];
      const force = options.stiffness * (spring.target - spring.current);
      const damping = options.damping * spring.velocity;
      
      // Update velocity with spring physics
      spring.velocity += (force - damping) / 100;
      spring.current += spring.velocity / 100;
      
      // Check if still moving
      if (Math.abs(spring.velocity) > 0.01 || Math.abs(spring.target - spring.current) > 0.01) {
        stillAnimating = true;
      }
      
      // Apply to element
      element.style[prop as any] = `${spring.current}${prop === 'opacity' ? '' : 'px'}`;
    });
    
    if (stillAnimating) {
      animationFrameId = requestAnimationFrame(animate);
    }
  };
  
  // Start animation
  animate();
  
  // Return function to cancel animation
  return () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  };
};
