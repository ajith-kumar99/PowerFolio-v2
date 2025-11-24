import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSmoothScroll } from "../context/SmoothScrollContext"; // Import our custom hook

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const lenis = useSmoothScroll();

  useEffect(() => {
    // If Lenis is ready, scroll to top instantly
    if (lenis) {
      lenis.scrollTo(0, { immediate: true }); 
    } else {
      // Fallback if lenis isn't loaded yet
      window.scrollTo(0, 0);
    }
  }, [pathname, lenis]);

  return null;
};

export default ScrollToTop;