import { useEffect, useState } from 'react';

/**
 * Hook to detect user's preference for reduced motion
 * Returns true if user prefers reduced motion, false otherwise
 */
export function usePRM(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Generate common stagger animation props for Framer Motion
 * @param delayBase - Base delay in seconds for staggering
 * @returns Object with stagger configuration
 */
export function motionStaggerProps(delayBase: number = 0.1) {
  return {
    initial: "hidden",
    animate: "visible",
    variants: {
      hidden: {
        opacity: 0,
      },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: delayBase,
          delayChildren: delayBase * 0.5,
        },
      },
    },
  };
}

/**
 * Individual item variants for staggered animations
 */
export const motionItemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};