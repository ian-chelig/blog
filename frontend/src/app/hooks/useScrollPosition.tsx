import { useEffect, useState } from "react";

const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = () => {
      // Use window.scrollY and window.scrollX for modern browsers
      // Fallbacks can be added for older browsers if necessary
      setScrollPosition({ x: window.scrollX, y: window.scrollY });
    };

    // Add event listener to the window
    window.addEventListener("scroll", updatePosition);

    // Initial position update on mount
    updatePosition();

    // Cleanup function to remove the event listener when the component unmounts
    return () => window.removeEventListener("scroll", updatePosition);
  }, []); // Empty dependency array ensures the effect runs only once on mount

  return scrollPosition;
};

export default useScrollPosition;
