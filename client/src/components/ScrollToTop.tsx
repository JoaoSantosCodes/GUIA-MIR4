import { useEffect } from "react";
import { useLocation } from "wouter";

/** Rolls the page to the top (or to an anchor) on route change. */
export default function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    if (location.includes("#")) {
      const id = location.split("#")[1];
      const el = document.getElementById(id);
      if (el) {
        // Let the layout render first, then scroll to the anchor
        requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth", block: "start" }));
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}
