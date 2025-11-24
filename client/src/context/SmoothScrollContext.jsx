import { createContext, useContext, useEffect, useState } from 'react';
import Lenis from 'lenis'; // Import the core library

const SmoothScrollContext = createContext();

// Custom hook to use Lenis anywhere in your app
export const useSmoothScroll = () => useContext(SmoothScrollContext);

export const SmoothScrollProvider = ({ children }) => {
  const [lenis, setLenis] = useState(null);

  useEffect(() => {
    // 1. Initialize Lenis
    const lenisInstance = new Lenis({
      duration: 1.5, // The smoothness duration (higher = smoother)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // refined easing
      smoothWheel: true,
    });

    setLenis(lenisInstance);

    // 2. Create the animation loop
    function raf(time) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);

    // 3. Cleanup on unmount
    return () => {
      lenisInstance.destroy();
    };
  }, []);

  return (
    <SmoothScrollContext.Provider value={lenis}>
      {children}
    </SmoothScrollContext.Provider>
  );
};