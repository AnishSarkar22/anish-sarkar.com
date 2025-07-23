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
  const ArrowCursorSVG = ({
    fill = "#FFF",
    stroke = "#41FFF5",
    size = 24,
    strokeWidth = 2,
  }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className="pointer-events-none"
    >
      <path
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.85a.5.5 0 0 0-.85.35Z"
      />
    </svg>
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
  const HandCursorSVG = ({
    size = 24,
    fill = "#FFF",
    stroke = "#00FFD0",
    strokeWidth = "2.25",
  }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className="pointer-events-none"
    >
      <path
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        d="M10 11V8.99c0-.88.59-1.64 1.44-1.86h.05A1.99 1.99 0 0 1 14 9.05V12v-2c0-.88.6-1.65 1.46-1.87h.05A1.98 1.98 0 0 1 18 10.06V13v-1.94a2 2 0 0 1 1.51-1.94h0A2 2 0 0 1 22 11.06V14c0 .6-.08 1.27-.21 1.97a7.96 7.96 0 0 1-7.55 6.48 54.98 54.98 0 0 1-4.48 0 7.96 7.96 0 0 1-7.55-6.48C2.08 15.27 2 14.59 2 14v-1.49c0-1.11.9-2.01 2.01-2.01h0a2 2 0 0 1 2.01 2.03l-.01.97v-10c0-1.1.9-2 2-2h0a2 2 0 0 1 2 2V11Z"
      />
    </svg>
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
        return (
          <HandCursorSVG
            fill="#5c33cc"
            stroke="#7a57db"
            size={32}
            strokeWidth={2.5}
          />
        );
      case "grab":
        return (
          <HandCursorSVG
            fill="#33c2cc"
            stroke="#57db96"
            size={28}
            strokeWidth={2}
          />
        );
      case "hover":
        return (
          <ArrowCursorSVG
            fill="#7a57db"
            stroke="#ca2f8c"
            size={60}
            strokeWidth={3}
          />
        );
      default:
        return (
          <ArrowCursorSVG
            fill="#FFF"
            stroke="#41FFF5"
            size={48}
            strokeWidth={2}
          />
        );
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
          type: "spring",
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
