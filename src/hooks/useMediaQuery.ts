import { useState, useEffect } from 'react';

/**
 * A hook that returns whether a media query matches
 * 
 * @param query The media query to check
 * @returns A boolean indicating whether the media query matches
 */
function useMediaQuery(query: string): boolean {
  const getMatches = (query: string): boolean => {
    // Prevents SSR issues
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState<boolean>(getMatches(query));

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    // Initial check
    setMatches(mediaQuery.matches);
    
    // Create an event listener
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    
    // Add the event listener
    mediaQuery.addEventListener('change', handler);
    
    // Remove event listener on cleanup
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/**
 * Predefined breakpoint media queries based on Tailwind CSS defaults
 */
export const breakpoints = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
  
  // Inverse (max-width) queries
  'max-sm': '(max-width: 639px)',
  'max-md': '(max-width: 767px)',
  'max-lg': '(max-width: 1023px)',
  'max-xl': '(max-width: 1279px)',
  'max-2xl': '(max-width: 1535px)',
  
  // Special queries
  dark: '(prefers-color-scheme: dark)',
  light: '(prefers-color-scheme: light)',
  portrait: '(orientation: portrait)',
  landscape: '(orientation: landscape)',
  retina: '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',
};

/**
 * A set of pre-configured hooks for common Tailwind CSS breakpoints
 */
export const useIsMobile = () => useMediaQuery(breakpoints['max-md']);
export const useIsTablet = () => useMediaQuery(breakpoints.md) && !useMediaQuery(breakpoints.lg);
export const useIsDesktop = () => useMediaQuery(breakpoints.lg);
export const useIsLargeDesktop = () => useMediaQuery(breakpoints.xl);
export const useIsDarkMode = () => useMediaQuery(breakpoints.dark);
export const useIsPortrait = () => useMediaQuery(breakpoints.portrait);
export const useIsLandscape = () => useMediaQuery(breakpoints.landscape);
export const useIsRetina = () => useMediaQuery(breakpoints.retina);

export default useMediaQuery;