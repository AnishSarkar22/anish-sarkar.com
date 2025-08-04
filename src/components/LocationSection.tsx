"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function LocationSection() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Memoize animation variants
  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    }),
    []
  );

  const titleVariants = useMemo(
    () => ({
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.2 } },
    }),
    []
  );

  // Memoize event handlers
  const handleHoverStart = useCallback((item: string) => {
    setHoveredItem(item);
  }, []);

  const handleHoverEnd = useCallback(() => {
    setHoveredItem(null);
  }, []);

  // Initialize map when component mounts
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    // Kolkata coordinates [lng, lat] for MapLibre GL (note the order change)
    const kolkataCoords: [number, number] = [88.3639, 22.5726];

    // Initialize MapLibre GL map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      center: kolkataCoords,
      zoom: 11,
      style: {
        version: 8,
        sources: {
          "raster-tiles": {
            type: "raster",
            tiles: [
              "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
            ],
            tileSize: 256,
            attribution: "Tiles © Esri",
          },
        },
        layers: [
          {
            id: "simple-tiles",
            type: "raster",
            source: "raster-tiles",
            minzoom: 0,
            maxzoom: 18,
          },
        ],
      },
      attributionControl: false,
      scrollZoom: true,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      dragPan: true,
    });

    // Create custom pulsing marker element
    const createPulsingMarker = () => {
      const el = document.createElement("div");
      el.className = "pulsing-marker";
      el.innerHTML = `
        <div class="pulse-container">
          <div class="pulse-outer"></div>
          <div class="pulse-inner"></div>
        </div>
      `;
      return el;
    };

    // Add marker to map
    const markerElement = createPulsingMarker();
    const marker = new maplibregl.Marker(markerElement)
      .setLngLat(kolkataCoords)
      .addTo(map.current);

    // Add custom CSS for pulsing animation
    const style = document.createElement("style");
    style.textContent = `
      .pulsing-marker {
        background: transparent !important;
        border: none !important;
      }
      
      .pulse-container {
        position: relative;
        width: 40px;
        height: 40px;
      }
      
      .pulse-outer {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 30px;
        height: 30px;
        background: rgba(52, 211, 153, 0.3);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: pulse 2s infinite;
      }
      
      .pulse-inner {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 12px;
        height: 12px;
        background: #34d399;
        border: 2px solid #ffffff;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        z-index: 10;
      }
      
      @keyframes pulse {
        0% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -50%) scale(2);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    // Set map as loaded when style loads
    map.current.on("load", () => {
      setMapLoaded(true);
    });

    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      // Remove the style element
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  return (
    <motion.div
      className="text-white mb-16 relative will-change-transform"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="text-2xl font-bold text-white relative inline-block"
        variants={titleVariants}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        whileHover={{ scale: 1.03 }}
      >
        <span className="text-green-300 inline-block will-change-transform">
          &gt;
        </span>{" "}
        <span className="relative group">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-green-200 to-white bg-[length:200%_100%] animate-shimmer">
            location
          </span>

          {/* Animated underline with glow */}
          {/* <motion.span
            className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-green-300/0 via-green-300 to-green-300/0 will-change-transform"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{ boxShadow: '0 2px 10px rgba(134, 239, 172, 0.3)' }}
          /> */}
        </span>
      </motion.h1>

      <div className="mt-10 relative">
        <motion.div
          className="relative rounded-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, delay: 0.3 },
          }}
          whileHover={{
            scale: 1.02,
            transition: { duration: 0.3 },
          }}
          onHoverStart={() => handleHoverStart("map")}
          onHoverEnd={handleHoverEnd}
        >
          {/* Map container */}
          <div
            ref={mapContainer}
            className="w-full h-[400px] rounded-xl relative z-10"
          />

          {/* Overlay with glass effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-20 rounded-xl overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{
              opacity: hoveredItem === "map" ? 1 : 0,
              transition: { duration: 0.3 },
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

            {/* Animated border */}
            <motion.div
              className="absolute top-0 left-0 w-full h-[1px]"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(52, 211, 153, 0.7), transparent)",
              }}
              animate={{
                left: ["-100%", "100%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <motion.div
              className="absolute bottom-0 right-0 w-full h-[1px]"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(52, 211, 153, 0.7), transparent)",
              }}
              animate={{
                right: ["-100%", "100%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <motion.div
              className="absolute left-0 top-0 h-full w-[1px]"
              style={{
                background:
                  "linear-gradient(180deg, transparent, rgba(52, 211, 153, 0.7), transparent)",
              }}
              animate={{
                top: ["-100%", "100%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <motion.div
              className="absolute right-0 bottom-0 h-full w-[1px]"
              style={{
                background:
                  "linear-gradient(180deg, transparent, rgba(52, 211, 153, 0.7), transparent)",
              }}
              animate={{
                bottom: ["-100%", "100%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </motion.div>

          {/* Loading indicator */}
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/80 z-30">
              <div className="flex space-x-2">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 rounded-full bg-green-300"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Location info */}
        <motion.div
          className="mt-6 relative pl-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, delay: 0.5 },
          }}
        >
          {/* Circle indicator */}
          <motion.div
            className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-green-300"
            animate={{
              scale: [1, 1.2, 1],
              boxShadow: [
                "0 0 0 rgba(52, 211, 153, 0.4)",
                "0 0 10px rgba(52, 211, 153, 0.7)",
                "0 0 0 rgba(52, 211, 153, 0.4)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />

          <motion.h3
            className="text-xl font-medium text-green-300"
            whileHover={{ scale: 1.02 }}
          >
            Kolkata, West Bengal, India
          </motion.h3>

          <motion.p
            className="text-zinc-400 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Currently living in the vibrant and bustling city of Kolkata.
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}
