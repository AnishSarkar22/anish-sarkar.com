"use client";
import TransitionLink from "./utils/TransitionLink";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NavBar = () => {
  const pathname = usePathname();
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHoveringNav, setIsHoveringNav] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  // Get active state for each nav item
  const isActive = (path: string) => pathname === path;

  // Toggle navbar collapse state
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Auto-expand when hovering for more than 800ms - REMOVE THIS EFFECT
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isHoveringNav && isCollapsed) {
      timer = setTimeout(() => {
        // Remove auto-expand behavior
      }, 800);
    }
    return () => clearTimeout(timer);
  }, [isHoveringNav, isCollapsed]);

  return (
    <>
      {/* Enhanced bottom screen gradient for content fading */}
      <div className="fixed bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none z-40"></div>

      {/* Navbar positioned on top of the fade effect */}
      <motion.nav
        className="fixed bottom-0 left-0 right-0 z-40 pb-6 px-4 flex justify-center"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        onMouseEnter={() => setIsHoveringNav(true)}
        onMouseLeave={() => setIsHoveringNav(false)}
      >
        <motion.div
          className={`relative backdrop-blur-md rounded-full w-fit border border-zinc-800 shadow-lg overflow-hidden ${
            scrolled ? "bg-zinc-900/80" : "bg-zinc-900/60"
          }`}
          whileHover={{
            scale: isCollapsed ? 1.05 : 1.02,
            boxShadow:
              "0 20px 30px -10px rgba(0, 0, 0, 0.7), 0 0 20px rgba(134, 239, 172, 0.4)",
          }}
          animate={{
            width: isCollapsed ? "auto" : "auto",
            height: isCollapsed ? "auto" : "auto",
            boxShadow: isCollapsed
              ? "0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 10px rgba(134, 239, 172, 0.2)"
              : "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(134, 239, 172, 0.3)",
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 17,
            width: { duration: 0.3 },
            height: { duration: 0.3 },
          }}
        >
          {/* Cosmic background effect */}
          <motion.div
            className="absolute inset-0 -z-10 opacity-30"
            animate={{
              background: isCollapsed
                ? "radial-gradient(circle at center, rgba(134, 239, 172, 0.2), transparent 70%)"
                : "radial-gradient(circle at center, rgba(134, 239, 172, 0.3), transparent 80%)",
            }}
            transition={{ duration: 0.5 }}
          />

          {/* Animated particles in background */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            {!isCollapsed &&
              [...Array(8)].map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute w-1 h-1 rounded-full bg-green-300/30"
                  initial={{
                    x: Math.random() * 100 + "%",
                    y: Math.random() * 100 + "%",
                    opacity: 0,
                  }}
                  animate={{
                    y: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
                    x: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
          </div>

          {/* Animated border glow */}
          <motion.div
            className="absolute inset-0 rounded-full -z-5 pointer-events-none"
            animate={{
              boxShadow: isCollapsed
                ? [
                    "inset 0 0 0 1px rgba(134, 239, 172, 0.1)",
                    "inset 0 0 0 1px rgba(134, 239, 172, 0.3)",
                    "inset 0 0 0 1px rgba(134, 239, 172, 0.1)",
                  ]
                : [
                    "inset 0 0 0 1px rgba(134, 239, 172, 0.2)",
                    "inset 0 0 0 1px rgba(134, 239, 172, 0.4)",
                    "inset 0 0 0 1px rgba(134, 239, 172, 0.2)",
                  ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />

          <AnimatePresence mode="wait">
            {isCollapsed ? (
              /* Collapsed state - just show menu button */
              <motion.div
                key="collapsed"
                className="p-3 flex items-center justify-center "
                initial={{ opacity: 0, scale: 0.8, width: 0 }}
                animate={{ opacity: 1, scale: 1, width: "auto" }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
                  width: 0,
                  transition: {
                    type: "spring",
                    stiffness: 800,
                    damping: 40,
                    mass: 0.8,
                    velocity: 10,
                  },
                }}
                transition={{
                  type: "spring",
                  stiffness: 800,
                  damping: 40,
                  mass: 0.8,
                  velocity: 10,
                  opacity: { duration: 0.15 },
                  scale: { duration: 0.2 },
                }}
              >
                <motion.button
                  onClick={toggleCollapse}
                  className="relative w-10 h-10 flex items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors"
                  whileHover={{
                    scale: 1.1,
                    rotate: [0, 5, -5, 5, 0],
                  }}
                  whileTap={{
                    scale: 0.9,
                    rotate: 0,
                  }}
                  transition={{
                    rotate: { duration: 0.5, ease: "easeInOut" },
                    scale: { type: "spring", stiffness: 500, damping: 10 },
                  }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{
                      boxShadow: [
                        "0 0 0 0 rgba(134, 239, 172, 0)",
                        "0 0 0 4px rgba(134, 239, 172, 0.3)",
                        "0 0 0 0 rgba(134, 239, 172, 0)",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={30}
                    height={30}
                    viewBox="0 0 24 24"
                    className="[transform:rotateY(180deg)]"
                  >
                    <path
                      fill="currentColor"
                      d="M4 18a.97.97 0 0 1-.712-.288A.97.97 0 0 1 3 17q0-.424.288-.712A.97.97 0 0 1 4 16h11q.425 0 .713.288A.97.97 0 0 1 16 17q0 .424-.287.712A.97.97 0 0 1 15 18z"
                      className="duoicon-primary-layer"
                    ></path>
                    <path
                      fill="currentColor"
                      d="m17.4 12l2.9 2.9a.95.95 0 0 1 .275.7a.95.95 0 0 1-.275.7a.95.95 0 0 1-.7.275a.95.95 0 0 1-.7-.275l-3.6-3.6a.96.96 0 0 1-.3-.7q0-.4.3-.7l3.6-3.6a.95.95 0 0 1 .7-.275q.425 0 .7.275a.95.95 0 0 1 .275.7a.95.95 0 0 1-.275.7z"
                      className="duoicon-secondary-layer"
                      opacity={0.6}
                    ></path>
                    <path
                      fill="currentColor"
                      d="M4 8a.97.97 0 0 1-.712-.287A.97.97 0 0 1 3 7q0-.425.288-.713A.97.97 0 0 1 4 6h11a.97.97 0 0 1 .713.287A.97.97 0 0 1 16 7a.97.97 0 0 1-.287.713A.97.97 0 0 1 15 8z"
                      className="duoicon-primary-layer"
                    ></path>
                    <path
                      fill="currentColor"
                      d="M4 13a.97.97 0 0 1-.712-.288A.97.97 0 0 1 3 12q0-.425.288-.713A.97.97 0 0 1 4 11h8a.97.97 0 0 1 .713.287A.97.97 0 0 1 13 12q0 .424-.287.712A.97.97 0 0 1 12 13z"
                      className="duoicon-secondary-layer"
                      opacity={0.65}
                    ></path>
                  </svg>

                  {/* Orbital particles */}
                  {/* <motion.div
                    className="absolute w-1.5 h-1.5 rounded-full bg-green-300/60"
                    animate={{
                      rotate: 360,
                      x: 15 * Math.cos(0),
                      y: 15 * Math.sin(0),
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <motion.div
                    className="absolute w-1 h-1 rounded-full bg-green-300/40"
                    animate={{
                      rotate: -360,
                      x: 15 * Math.cos((Math.PI * 2) / 3),
                      y: 15 * Math.sin((Math.PI * 2) / 3),
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <motion.div
                    className="absolute w-1 h-1 rounded-full bg-green-300/40"
                    animate={{
                      rotate: 180,
                      x: 15 * Math.cos((Math.PI * 4) / 3),
                      y: 15 * Math.sin((Math.PI * 4) / 3),
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  /> */}
                </motion.button>
              </motion.div>
            ) : (
              /* Expanded state - show full navbar */
              <motion.div
                key="expanded"
                className="flex justify-center items-center py-3 px-5 relative"
                initial={{ opacity: 0, width: 0, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  width: "auto",
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 800,
                    damping: 40,
                    mass: 0.8,
                    velocity: 10,
                    width: { duration: 0.2 },
                    opacity: { duration: 0.2, delay: 0.05 },
                    scale: { duration: 0.2, delay: 0.05 },
                  },
                }}
                exit={{
                  opacity: 0,
                  width: 0,
                  scale: 0.9,
                  transition: {
                    type: "spring",
                    stiffness: 800,
                    damping: 40,
                    mass: 0.8,
                    velocity: 10,
                    width: { duration: 0.2, delay: 0.05 },
                    opacity: { duration: 0.15 },
                    scale: { duration: 0.15 },
                  },
                }}
              >
                <NavItem
                  href="/"
                  icon={{
                    filled: (props: React.ComponentProps<"svg">) => (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        {...props}
                      >
                        <path
                          fill="currentColor"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="m7.088 4.764l-1 .78C4.572 6.73 3.813 7.322 3.407 8.157S3 9.956 3 11.885v2.092c0 3.786 0 5.68 1.172 6.855C5.115 21.78 6.52 21.965 9 22v-3.994c0-.932 0-1.398.152-1.766a2 2 0 0 1 1.083-1.082c.367-.152.833-.152 1.765-.152s1.398 0 1.765.152a2 2 0 0 1 1.083 1.082c.152.368.152.834.152 1.766V22c2.48-.036 3.885-.22 4.828-1.168C21 19.657 21 17.764 21 13.978v-2.092c0-1.93 0-2.894-.407-3.729s-1.165-1.427-2.681-2.611l-1-.781C14.552 2.92 13.372 2 12 2s-2.552.921-4.912 2.764"
                        ></path>
                      </svg>
                    ),
                    outline: (props: React.ComponentProps<"svg">) => (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        {...props}
                      >
                        <path
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="m7.088 4.764l-1 .78C4.572 6.73 3.813 7.322 3.407 8.157S3 9.956 3 11.885v2.092c0 3.786 0 5.68 1.172 6.855C5.115 21.78 6.52 21.965 9 22v-3.994c0-.932 0-1.398.152-1.766a2 2 0 0 1 1.083-1.082c.367-.152.833-.152 1.765-.152s1.398 0 1.765.152a2 2 0 0 1 1.083 1.082c.152.368.152.834.152 1.766V22c2.48-.036 3.885-.22 4.828-1.168C21 19.657 21 17.764 21 13.978v-2.092c0-1.93 0-2.894-.407-3.729s-1.165-1.427-2.681-2.611l-1-.781C14.552 2.92 13.372 2 12 2s-2.552.921-4.912 2.764"
                        ></path>
                      </svg>
                    ),
                  }}
                  name="home"
                  isActive={isActive("/")}
                  hoveredIcon={hoveredIcon}
                  setHoveredIcon={setHoveredIcon}
                />

                <div className="flex items-center">
                  <div className="h-6 w-px bg-zinc-600/50 mx-5"></div>
                </div>

                <NavItem
                  href="/projects"
                  icon={{
                    filled: (props: React.ComponentProps<"svg">) => (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        {...props}
                      >
                        <path
                          fill="currentColor"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12.828 6.001a3 3 0 1 0-5.658 0c-2.285.008-3.504.09-4.292.878S2.008 8.886 2 11.17a3 3 0 1 1 0 5.66c.008 2.284.09 3.503.878 4.291s2.007.87 4.291.878a3 3 0 1 1 5.66 0c2.284-.008 3.503-.09 4.291-.878s.87-2.007.878-4.292a3 3 0 1 0 0-5.658c-.008-2.285-.09-3.504-.878-4.292c-.788-.789-2.007-.87-4.292-.878"
                        ></path>
                      </svg>
                    ),
                    outline: (props: React.ComponentProps<"svg">) => (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        {...props}
                      >
                        <path
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12.828 6.001a3 3 0 1 0-5.658 0c-2.285.008-3.504.09-4.292.878S2.008 8.886 2 11.17a3 3 0 1 1 0 5.66c.008 2.284.09 3.503.878 4.291s2.007.87 4.291.878a3 3 0 1 1 5.66 0c2.284-.008 3.503-.09 4.291-.878s.87-2.007.878-4.292a3 3 0 1 0 0-5.658c-.008-2.285-.09-3.504-.878-4.292c-.788-.789-2.007-.87-4.292-.878"
                        ></path>
                      </svg>
                    ),
                  }}
                  name="projects"
                  isActive={isActive("/projects")}
                  hoveredIcon={hoveredIcon}
                  setHoveredIcon={setHoveredIcon}
                />

                <div className="flex items-center">
                  <div className="h-6 w-px bg-zinc-600/50 mx-5"></div>
                </div>

                <NavItem
                  href="/blog"
                  icon={{
                    filled: (props: React.ComponentProps<"svg">) => (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        {...props}
                      >
                        <g
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                        >
                          <path
                            fill="none"
                            d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12m7.5-2h1m-1 5h4"
                          />
                          <path
                            fill="currentColor"
                            d="M14.958 11.462v-.953c0-1.873 0-2.81-.476-3.466c-.9-1.243-2.649-1.029-4.003-1.029S7.376 5.8 6.475 7.044C6 7.7 6 8.635 6 10.508v2.497c0 2.354 0 3.531.729 4.263S8.63 18 10.977 18h3.71c2.598 0 3.637-1.828 3.226-4.431c-.245-1.55-1.582-2.107-2.955-2.107"
                          />
                        </g>
                      </svg>
                    ),
                    outline: (props: React.ComponentProps<"svg">) => (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        {...props}
                      >
                        <g
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                        >
                          <path d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12m7.5-2h1m-1 5h4"></path>
                          <path d="M14.958 11.462v-.953c0-1.873 0-2.81-.476-3.466c-.9-1.243-2.649-1.029-4.003-1.029S7.376 5.8 6.475 7.044C6 7.7 6 8.635 6 10.508v2.497c0 2.354 0 3.531.729 4.263S8.63 18 10.977 18h3.71c2.598 0 3.637-1.828 3.226-4.431c-.245-1.55-1.582-2.107-2.955-2.107"></path>
                        </g>
                      </svg>
                    ),
                  }}
                  name="blog"
                  isActive={isActive("/blog")}
                  hoveredIcon={hoveredIcon}
                  setHoveredIcon={setHoveredIcon}
                />
                <div className="flex items-center">
                  <div className="h-6 w-px bg-zinc-600/50 mx-5"></div>
                </div>

                {/* PHOTOS SECTION */}
                {/* <NavItem
                  href="/photos"
                  icon={{
                    filled: (props: React.ComponentProps<"svg">) => (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={28}
                        height={28}
                        viewBox="0 0 24 24"
                        {...props}
                      >
                        <path
                          fill="currentColor"
                          fillRule="evenodd"
                          d="M7.268 4.658a54.7 54.7 0 0 1 9.465 0l1.51.132a3.14 3.14 0 0 1 2.831 2.66a30.6 30.6 0 0 1 0 9.1q-.061.397-.212.754c-.066.157-.27.181-.386.055l-4.421-4.864a.75.75 0 0 0-.792-.207l-2.531.844l-3.671-4.13A.75.75 0 0 0 7.97 8.97l-4.914 4.914a.246.246 0 0 1-.422-.159a30.6 30.6 0 0 1 .292-6.276a3.14 3.14 0 0 1 2.831-2.66zM14 9a1.5 1.5 0 1 1 3 0a1.5 1.5 0 0 1-3 0"
                          clipRule="evenodd"
                        ></path>
                        <path
                          fill="currentColor"
                          d="M2.961 16.1a.25.25 0 0 0-.07.21l.035.24a3.14 3.14 0 0 0 2.831 2.66l1.51.131c3.15.274 6.316.274 9.466 0l1.51-.131a3.1 3.1 0 0 0 1.185-.347c.137-.071.16-.252.056-.366l-4.1-4.51a.25.25 0 0 0-.265-.07l-2.382.794a.75.75 0 0 1-.798-.213l-3.295-3.707a.25.25 0 0 0-.364-.01z"
                        ></path>
                      </svg>
                    ),
                    outline: (props: React.ComponentProps<"svg">) => (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={28}
                        height={28}
                        viewBox="0 0 24 24"
                        {...props}
                      >
                        <path
                          fill="currentColor"
                          d="M14 9a1.5 1.5 0 1 1 3 0a1.5 1.5 0 0 1-3 0"
                        ></path>
                        <path
                          fill="currentColor"
                          fillRule="evenodd"
                          d="M7.268 4.658a54.7 54.7 0 0 1 9.465 0l1.51.132a3.14 3.14 0 0 1 2.831 2.66a30.6 30.6 0 0 1 0 9.1a3.14 3.14 0 0 1-2.831 2.66l-1.51.131c-3.15.274-6.316.274-9.465 0l-1.51-.131a3.14 3.14 0 0 1-2.832-2.66a30.6 30.6 0 0 1 0-9.1a3.14 3.14 0 0 1 2.831-2.66zm9.335 1.495a53 53 0 0 0-9.206 0l-1.51.131A1.64 1.64 0 0 0 4.41 7.672a29 29 0 0 0-.311 5.17L7.97 8.97a.75.75 0 0 1 1.09.032l3.672 4.13l2.53-.844a.75.75 0 0 1 .796.21l3.519 3.91l.014-.08a29.1 29.1 0 0 0 0-8.656a1.64 1.64 0 0 0-1.478-1.388zm2.017 11.435l-3.349-3.721l-2.534.844a.75.75 0 0 1-.798-.213l-3.471-3.905l-4.244 4.243q.073.748.185 1.491a1.64 1.64 0 0 0 1.478 1.389l1.51.131c3.063.266 6.143.266 9.206 0l1.51-.131c.178-.016.35-.06.507-.128"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    ),
                  }}
                  name="photos"
                  isActive={isActive("/photos")}
                  hoveredIcon={hoveredIcon}
                  setHoveredIcon={setHoveredIcon}
                />

                <div className="flex items-center">
                  <div className="h-6 w-px bg-zinc-600/50 mx-5"></div>
                </div> */}

                {/* CREDITS SECTION */}
                {/* <NavItem
                  href="/credits"
                  icon={{
                    filled: (props: React.ComponentProps<"svg">) => (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={28}
                        height={28}
                        viewBox="0 0 256 256"
                        {...props}
                      >
                        <g
                          fill="currentColor"
                          strokeWidth={6.5}
                          stroke="currentColor"
                        >
                          <path
                            d="M224 128a96 96 0 1 1-96-96a96 96 0 0 1 96 96"
                            opacity={0.2}
                          ></path>
                          <path d="M144 176a8 8 0 0 1-8 8a16 16 0 0 1-16-16v-40a8 8 0 0 1 0-16a16 16 0 0 1 16 16v40a8 8 0 0 1 8 8m88-48A104 104 0 1 1 128 24a104.11 104.11 0 0 1 104 104m-16 0a88 88 0 1 0-88 88a88.1 88.1 0 0 0 88-88m-92-32a12 12 0 1 0-12-12a12 12 0 0 0 12 12"></path>
                        </g>
                      </svg>
                    ),
                    outline: (props: React.ComponentProps<"svg">) => (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={28}
                        height={28}
                        viewBox="0 0 256 256"
                        {...props}
                      >
                        <path
                          fill="currentColor"
                          d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88m16-40a8 8 0 0 1-8 8a16 16 0 0 1-16-16v-40a8 8 0 0 1 0-16a16 16 0 0 1 16 16v40a8 8 0 0 1 8 8m-32-92a12 12 0 1 1 12 12a12 12 0 0 1-12-12"
                          strokeWidth={6.5}
                          stroke="currentColor"
                        ></path>
                      </svg>
                    ),
                  }}
                  name="credits"
                  isActive={isActive("/credits")}
                  hoveredIcon={hoveredIcon}
                  setHoveredIcon={setHoveredIcon}
                />

                <div className="flex items-center">
                  <div className="h-6 w-px bg-zinc-600/50 mx-5"></div>
                </div>   */}

                {/* Collapse button */}
                <motion.button
                  onClick={toggleCollapse}
                  className="relative w-10 h-10 flex items-center justify-center ml-5 group"
                  whileHover={{
                    scale: 1.1,
                    rotate: [0, -5, 5, -5, 0],
                  }}
                  whileTap={{
                    scale: 0.9,
                    rotate: 0,
                  }}
                  transition={{
                    rotate: { duration: 0.5, ease: "easeInOut" },
                    scale: { type: "spring", stiffness: 500, damping: 10 },
                  }}
                >
                  {/* Always visible background */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-zinc-800/50 group-hover:bg-zinc-800/10 transition-all duration-300"
                    animate={{
                      boxShadow: "0 0 10px rgba(134, 239, 172, 0.3)",
                    }}
                    whileHover={{
                      boxShadow: "0 0 25px rgba(134, 239, 172, 0.6)",
                      background:
                        "linear-gradient(135deg, rgba(52, 52, 52, 0.9), rgba(23, 23, 23, 0.9))",
                    }}
                  />

                  {/* Icon with animation */}
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 0 }}
                    whileHover={{ rotate: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={30}
                      height={30}
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M4 18a.97.97 0 0 1-.712-.288A.97.97 0 0 1 3 17q0-.424.288-.712A.97.97 0 0 1 4 16h11q.425 0 .713.288A.97.97 0 0 1 16 17q0 .424-.287.712A.97.97 0 0 1 15 18z"
                        className="duoicon-primary-layer"
                      ></path>
                      <path
                        fill="currentColor"
                        d="m17.4 12l2.9 2.9a.95.95 0 0 1 .275.7a.95.95 0 0 1-.275.7a.95.95 0 0 1-.7.275a.95.95 0 0 1-.7-.275l-3.6-3.6a.96.96 0 0 1-.3-.7q0-.4.3-.7l3.6-3.6a.95.95 0 0 1 .7-.275q.425 0 .7.275a.95.95 0 0 1 .275.7a.95.95 0 0 1-.275.7z"
                        className="duoicon-secondary-layer"
                        opacity={0.6}
                      ></path>
                      <path
                        fill="currentColor"
                        d="M4 8a.97.97 0 0 1-.712-.287A.97.97 0 0 1 3 7q0-.425.288-.713A.97.97 0 0 1 4 6h11a.97.97 0 0 1 .713.287A.97.97 0 0 1 16 7a.97.97 0 0 1-.287.713A.97.97 0 0 1 15 8z"
                        className="duoicon-primary-layer"
                      ></path>
                      <path
                        fill="currentColor"
                        d="M4 13a.97.97 0 0 1-.712-.288A.97.97 0 0 1 3 12q0-.425.288-.713A.97.97 0 0 1 4 11h8a.97.97 0 0 1 .713.287A.97.97 0 0 1 13 12q0 .424-.287.712A.97.97 0 0 1 12 13z"
                        className="duoicon-secondary-layer"
                        opacity={0.65}
                      ></path>
                    </svg>
                  </motion.div>

                  {/* Always visible halo effect around button */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{
                      boxShadow: [
                        "0 0 0 1px rgba(134, 239, 172, 0.2)",
                        "0 0 0 2px rgba(134, 239, 172, 0.3)",
                        "0 0 0 1px rgba(134, 239, 172, 0.2)",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  />

                  {/* Enhanced radial glow on hover */}
                  <motion.div
                    className="absolute inset-0 rounded-full opacity-30 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background:
                        "radial-gradient(circle at center, rgba(134, 239, 172, 0.3) 0%, transparent 70%)",
                    }}
                  />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.nav>
    </>
  );
};

// NavItem component for cleaner code
interface NavItemProps {
  href: string;
  icon: {
    filled: React.ElementType;
    outline: React.ElementType;
  };
  name: string;
  isActive: boolean;
  hoveredIcon: string | null;
  setHoveredIcon: (name: string | null) => void;
}

// NavItem component to move tooltip outside of overflow container
const NavItem = ({
  href,
  icon,
  name,
  isActive,
  hoveredIcon,
  setHoveredIcon,
}: NavItemProps) => {
  const isHovered = hoveredIcon === name;
  const FilledIcon = icon.filled;
  const OutlineIcon = icon.outline;

  return (
    <>
      <TransitionLink
        href={href}
        className="group relative w-10 h-10 flex items-center justify-center"
        onMouseEnter={() => setHoveredIcon(name)}
        onMouseLeave={() => setHoveredIcon(null)}
      >
        {/* Cosmic background effect */}
        <motion.div
          className={`absolute inset-0 rounded-full overflow-hidden ${
            isActive || isHovered ? "opacity-100" : "opacity-0"
          }`}
          initial={{ opacity: 0 }}
          animate={{
            opacity: isActive || isHovered ? 1 : 0,
            scale: isActive || isHovered ? 1 : 0.8,
          }}
          transition={{
            duration: 0.3,
            type: "spring",
            stiffness: 500,
            damping: 15,
          }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-green-300 to-emerald-400 opacity-80"
            animate={{
              background:
                isHovered && !isActive
                  ? "linear-gradient(135deg, rgba(134, 239, 172, 0.9), rgba(110, 231, 183, 0.9))"
                  : "linear-gradient(135deg, rgba(134, 239, 172, 0.8), rgba(110, 231, 183, 0.8))",
            }}
            transition={{ duration: 0.5 }}
          />
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, transparent 50%)",
                "radial-gradient(circle at 70% 70%, rgba(255,255,255,0.8) 0%, transparent 50%)",
                "radial-gradient(circle at 30% 70%, rgba(255,255,255,0.8) 0%, transparent 50%)",
                "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.8) 0%, transparent 50%)",
                "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, transparent 50%)",
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </motion.div>

        {/* Main button background with glow */}
        <motion.div
          className={`absolute inset-0 rounded-full ${
            isActive || isHovered ? "bg-green-300" : "bg-zinc-800"
          }`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isActive || isHovered ? 1 : 0,
            scale: isActive || isHovered ? 1 : 0.8,
            boxShadow:
              isActive || isHovered
                ? "0 0 30px rgba(134,239,172,0.9), inset 0 0 15px rgba(255,255,255,0.5)"
                : "none",
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 15,
          }}
        />

        {/* Multiple animated rings */}
        {(isActive || isHovered) && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-green-300/50"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{
                opacity: [0.7, 0.5, 0.7],
                scale: [1.1, 1.2, 1.1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border border-green-200/30"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{
                opacity: [0.5, 0.3, 0.5],
                scale: [1.3, 1.4, 1.3],
                rotate: [0, -180, -360],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border border-green-100/20"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{
                opacity: [0.3, 0.1, 0.3],
                scale: [1.5, 1.6, 1.5],
                rotate: [0, 90, 180, 270, 360],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </>
        )}

        {/* Icon container with cosmic effects */}
        <div className="relative w-6 h-6 flex items-center justify-center z-10">
          <FilledIcon
            size={22}
            className={`absolute transition-all duration-300 ${
              isActive ? "text-zinc-900 scale-100" : "text-zinc-900 scale-0"
            } ${isHovered && !isActive ? "scale-100" : ""}`}
          />
          <OutlineIcon
            size={22}
            className={`absolute transition-all duration-300 text-white/80 ${
              isActive || isHovered ? "scale-0" : "scale-100"
            }`}
          />

          {/* Particle effects */}
          {(isActive || isHovered) && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Orbital particles */}
              {/* {[...Array(12)].map((_, i) => {
                const angle = (i / 12) * Math.PI * 2;
                const radius = 12 + Math.random() * 5;
                const size = 0.5 + Math.random() * 1.5;
                const duration = 2 + Math.random() * 3;
                const delay = Math.random() * 2;

                return (
                  <motion.span
                    key={i}
                    className="absolute bg-white rounded-full"
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      x: Math.cos(angle) * radius,
                      y: Math.sin(angle) * radius,
                      boxShadow: "0 0 3px rgba(255,255,255,0.8)",
                    }}
                    animate={{
                      x: [
                        Math.cos(angle) * radius,
                        Math.cos(angle + Math.PI) * radius,
                        Math.cos(angle + Math.PI * 2) * radius,
                      ],
                      y: [
                        Math.sin(angle) * radius,
                        Math.sin(angle + Math.PI) * radius,
                        Math.sin(angle + Math.PI * 2) * radius,
                      ],
                      scale: [1, 1.5, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: duration,
                      repeat: Infinity,
                      delay: delay,
                      ease: "linear",
                    }}
                  />
                );
              })} */}

              {/* Center beam effect */}
              <motion.div
                className="absolute w-full h-full rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(255,255,255,0.9) 0%, transparent 50%)",
                }}
                animate={{
                  opacity: [0.7, 0.3, 0.7],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          )}
        </div>
      </TransitionLink>
    </>
  );
};

export default NavBar;
