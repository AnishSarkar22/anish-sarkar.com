import { useState, useEffect } from "react";
import { motion } from "motion/react";
import PropTypes from "prop-types";

function Navigation({ isMobile = false, onLinkClick }) {
  const handleLinkClick = () => {
    if (isMobile && onLinkClick) {
      onLinkClick();
    }
  };

  return (
    <ul className={`nav-ul ${isMobile ? "!flex-col !gap-4 w-full" : ""}`}>
      <li className={`nav-li ${isMobile ? "w-full text-center" : ""}`}>
        <a
          className="nav-link block py-2"
          href="#home"
          onClick={handleLinkClick}
        >
          Home
        </a>
      </li>
      <li className={`nav-li ${isMobile ? "w-full text-center" : ""}`}>
        <a
          className="nav-link block py-2"
          href="#about"
          onClick={handleLinkClick}
        >
          About
        </a>
      </li>
      <li className={`nav-li ${isMobile ? "w-full text-center" : ""}`}>
        <a
          className="nav-link block py-2"
          href="#work"
          onClick={handleLinkClick}
        >
          Work
        </a>
      </li>
      <li className={`nav-li ${isMobile ? "w-full text-center" : ""}`}>
        <a
          className="nav-link block py-2"
          href="#contact"
          onClick={handleLinkClick}
        >
          Contact
        </a>
      </li>
    </ul>
  );
}

Navigation.propTypes = {
  isMobile: PropTypes.bool,
  onLinkClick: PropTypes.func,
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside or on links
  const closeMobileMenu = () => {
    setIsOpen(false);
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <motion.div
        className={`fixed z-50 backdrop-blur-xl bg-white/10 shadow-lg transition-all duration-300 ${
          isScrolled
            ? "top-0 left-0 right-0 w-full rounded-none bg-white/5 border-white/10"
            : "top-4 left-1/2 transform -translate-x-1/2 rounded-full px-4 w-auto max-w-xs sm:max-w-md"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
        }}
      >
        <div
          className={`mx-auto ${
            isScrolled
              ? "px-2 sm:px-4 md:px-6 lg:px-8 max-w-3xl sm:max-w-4xl"
              : "px-2 sm:px-3"
          }`}
        >
          <div
            className={`flex items-center ${
              isScrolled
                ? "justify-between py-2"
                : "justify-between py-2 sm:py-2"
            }sm:h-auto h-14`}
          >
            <a
              href="/"
              className="text-lg font-bold transition-colors text-white/90 hover:text-white z-50 relative"
            >
              Anish
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex cursor-pointer text-white/80 hover:text-white focus:outline-none sm:hidden transition-colors duration-200 z-50 relative"
              aria-label="Toggle navigation menu"
            >
              <img
                src={isOpen ? "/assets/close.svg" : "/assets/menu.svg"}
                className="w-6 h-6 ml-7"
                alt="toggle"
              />
            </button>
            <nav className="hidden sm:flex ml-4 sm:ml-8">
              <Navigation />
            </nav>
          </div>
        </div>
      </motion.div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 sm:hidden"
            onClick={closeMobileMenu}
          />

          {/* Mobile Menu */}
          <motion.div
            className="fixed top-0 left-0 right-0 z-45 bg-white/10 backdrop-blur-xl border-b border-white/20 sm:hidden shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
            }}
          >
            <div className="pt-20 pb-8 px-6">
              <nav>
                <Navigation isMobile={true} onLinkClick={closeMobileMenu} />
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
};

export default Navbar;
