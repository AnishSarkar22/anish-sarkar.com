import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import PropTypes from "prop-types";

const CustomCursor = () => {
  const [isMobile, setIsMobile] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [cursorVariant, setCursorVariant] = useState("default");

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  
  // To use direct motion values for no bounciness

  // const cursorXSpring = cursorX;
  // const cursorYSpring = cursorY;

  useEffect(() => {
    // Check if device is mobile/tablet
    const checkMobile = () => {
      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 1024; // Tablets and below
      const isMobileUserAgent =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      return isTouchDevice || isSmallScreen || isMobileUserAgent;
    };

    const handleResize = () => {
      setIsMobile(checkMobile());
    };

    // Initial check
    setIsMobile(checkMobile());

    // Listen for resize events
    window.addEventListener("resize", handleResize);

    // If mobile, don't initialize cursor
    if (checkMobile()) {
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }

    const moveCursor = (e) => {
      const offset = getCursorOffset(cursorVariant);
      cursorX.set(e.clientX - offset.x);
      cursorY.set(e.clientY - offset.y);
    };

    const handleMouseEnter = (e) => {
      const target = e.target;

      // Force hide cursor on target element
      target.style.cursor = "none";

      // Check for different cursor states
      if (target.closest('input, textarea, [contenteditable="true"]')) {
        setIsHovering(true);
        setCursorVariant("text");
        setCursorText("Type");
      } else if (target.closest('a, button, [role="button"]')) {
        setIsHovering(true);
        setCursorVariant("pointer");

        // Add text for specific elements
        if (target.closest(".nav-link")) {
          setCursorText("Navigate");
        } else if (target.closest('button[type="submit"]')) {
          setCursorText("Send");
        } else if (target.closest('a[href^="mailto"]')) {
          setCursorText("Email");
        } else if (target.closest(".project-item")) {
          setCursorText("View");
        } else {
          setCursorText("Click");
        }
      } else if (target.closest('.draggable, [drag="true"]')) {
        setIsHovering(true);
        setCursorVariant("grab");
        setCursorText("Drag");
      } else if (target.closest(".hover-animation")) {
        setIsHovering(true);
        setCursorVariant("hover");
        setCursorText("");
      }
    };

    const handleMouseLeave = (e) => {
      // Keep cursor hidden when leaving elements
      const target = e.target;
      target.style.cursor = "none";

      setIsHovering(false);
      setCursorVariant("default");
      setCursorText("");
    };

    const handleFocus = (e) => {
      // Hide cursor on focus for input elements
      const target = e.target;
      if (target.matches('input, textarea, [contenteditable="true"]')) {
        target.style.cursor = "none";
        target.style.caretColor = "white"; // Keep the text caret visible
      }
    };

    // Hide default cursor globally
    document.body.style.cursor = "none";

    // Apply cursor none to all elements
    const style = document.createElement("style");
    style.textContent = `
      *, *::before, *::after {
        cursor: none !important;
      }
      input, textarea, [contenteditable="true"] {
        cursor: none !important;
        caret-color: white !important;
      }
      input:focus, textarea:focus, [contenteditable="true"]:focus {
        cursor: none !important;
        caret-color: white !important;
      }
    `;
    document.head.appendChild(style);

    // Add event listeners
    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("focus", handleFocus, true);

    // Add hover listeners to all interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, input, textarea, [role="button"], .hover-animation, .draggable, [drag="true"], [contenteditable="true"]'
    );

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
      // Force cursor none on each element
      el.style.cursor = "none";
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.style.cursor = "auto";
      if (style && style.parentNode) {
        document.head.removeChild(style);
      }
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("focus", handleFocus, true);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
        el.style.cursor = "";
      });
    };
  }, [cursorX, cursorY, cursorVariant]);

  // Function to get cursor offset based on variant
  const getCursorOffset = (variant) => {
    switch (variant) {
      case "text":
        return { x: 2, y: 12 }; // Center the I-beam cursor
      case "pointer":
        return { x: 8, y: 8 }; // Hand cursor offset
      default:
        return { x: 24, y: 24 }; // Default arrow cursor offset
    }
  };

  // Arrow Cursor SVG
  const ArrowCursorSVG = ({ size = 24 }) => (
    <img
      src="/assets/arrow-pointer.svg"
      width={size}
      height={size * 1.33} // 36x48 ratio
      alt="Arrow Cursor"
      draggable={false}
      className="pointer-events-none select-none"
      style={{ display: "block" }}
    />
  );

  // Text/I-beam Cursor SVG
  const TextCursorSVG = ({ fill = "#FFF", size = 24 }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className="pointer-events-none"
    >
      <path
        fill={fill}
        d="M11 2h2v2h2v2h-2v12h2v2h-2v2h-2v-2H9v-2h2V6H9V4h2V2z"
      />
    </svg>
  );

  // Hand/Pointer Cursor SVG
  const HandCursorSVG = ({ size = 24 }) => (
    <img
      src="/assets/hand-pointer.svg"
      width={size}
      height={size}
      alt="Hand Cursor"
      draggable={false}
      className="pointer-events-none select-none"
      style={{ display: "block" }}
    />
  );

  ArrowCursorSVG.propTypes = {
    fill: PropTypes.string,
    stroke: PropTypes.string,
    size: PropTypes.number,
    strokeWidth: PropTypes.number,
  };

  TextCursorSVG.propTypes = {
    fill: PropTypes.string,
    size: PropTypes.number,
  };

  HandCursorSVG.propTypes = {
    fill: PropTypes.string,
    stroke: PropTypes.string,
    size: PropTypes.number,
    strokeWidth: PropTypes.number,
  };

  const variants = {
    default: {
      scale: 1,
      rotate: 0,
    },
    pointer: {
      scale: 1.1,
      rotate: 0,
    },
    grab: {
      scale: 1.1,
      rotate: -10,
    },
    text: {
      scale: 1,
      rotate: 0,
    },
    hover: {
      scale: 1.3,
      rotate: 25,
    },
  };

  // Get cursor component and props based on variant
  const getCursorComponent = () => {
    switch (cursorVariant) {
      case "text":
        return <TextCursorSVG fill="#ffffff" size={24} />;
      case "pointer":
        return <HandCursorSVG size={32} />;
      case "grab":
        return <HandCursorSVG size={28} />;
      case "hover":
        return <ArrowCursorSVG size={60} />;
      default:
        return <ArrowCursorSVG size={48} />;
    }
  };

  // Get text position offset to avoid overlap
  const getTextOffset = () => {
    switch (cursorVariant) {
      case "text":
        return { x: 20, y: -10 }; // Position text to the right of I-beam
      case "pointer":
        return { x: 35, y: 5 }; // Position text to the right of hand
      default:
        return { x: 50, y: 10 }; // Default position for arrow cursor
    }
  };

  const textOffset = getTextOffset();

  // Don't render cursor on mobile devices
  if (isMobile) {
    return null;
  }

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
        animate={cursorVariant}
        variants={variants}
        transition={{
          type: "spring",  // if you don't want to use spring then replace it with "tween"
          stiffness: 500,
          damping: 28,
        }}
      >
        {getCursorComponent()}
      </motion.div>

      {/* Cursor text */}
      {cursorText && (
        <motion.div
          className="fixed top-0 left-0 z-[9998] pointer-events-none text-xs font-medium text-white bg-black/80 px-2 py-1 rounded-md whitespace-nowrap"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
            marginLeft: textOffset.x,
            marginTop: textOffset.y,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          {cursorText}
        </motion.div>
      )}
    </>
  );
};

export default CustomCursor;
