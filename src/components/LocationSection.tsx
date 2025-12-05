"use client";

import { motion } from "framer-motion";
import maplibregl from "maplibre-gl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
		[],
	);

	const titleVariants = useMemo(
		() => ({
			hidden: { opacity: 0, x: -20 },
			visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.2 } },
		}),
		[],
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
			el.setAttribute("aria-hidden", "true");
			el.tabIndex = -1;
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
		const _marker = new maplibregl.Marker(markerElement)
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

		// Set map as loaded when style loads and ensure canvas sizing is correct
		const onLoad = () => {
			setMapLoaded(true);
			// Increased delay and multiple resize calls to ensure proper rendering
			setTimeout(() => {
				map.current?.resize();
				// Second resize after a longer delay to catch any layout shifts
				setTimeout(() => map.current?.resize(), 100);
			}, 100);
		};
		map.current.on("load", onLoad);

		// keep map sized when window resizes
		const handleResize = () => map.current?.resize();
		window.addEventListener("resize", handleResize);

		// Clean up on unmount
		return () => {
			window.removeEventListener("resize", handleResize);
			if (map.current) {
				map.current.off("load", onLoad);
				map.current.remove();
				map.current = null;
			}
			// Remove the style element
			if (style.parentNode) {
				style.parentNode.removeChild(style);
			}
		};
	}, []);

	// useEffect(() => {
	//     if (!mapContainer.current || !map.current) return;

	//     const observer = new IntersectionObserver(
	//         (entries) => {
	//             entries.forEach((entry) => {
	//                 if (entry.isIntersecting && map.current) {
	//                     // Resize when map becomes visible
	//                     setTimeout(() => map.current?.resize(), 100);
	//                 }
	//             });
	//         },
	//         { threshold: 0.1 }
	//     );

	//     observer.observe(mapContainer.current);

	//     return () => observer.disconnect();
	// }, []);

	return (
		<motion.div
			className="relative mb-16 text-white will-change-transform"
			variants={containerVariants}
			initial="hidden"
			animate="visible"
		>
			<motion.h1
				className="relative inline-block font-bold text-2xl text-white"
				variants={titleVariants}
				transition={{ type: "spring", stiffness: 400, damping: 10 }}
				whileHover={{ scale: 1.03 }}
			>
				<span className="inline-block text-green-300 will-change-transform">
					&gt;
				</span>{" "}
				<span className="group relative">
					<span className="animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-white via-green-200 to-white bg-clip-text text-transparent">
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

			<div className="relative mt-10">
				<motion.div
					className="relative overflow-hidden rounded-xl"
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
						className="relative z-10 h-[400px] w-full rounded-xl"
					/>

					{/* Overlay with glass effect */}
					<motion.div
						className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-xl"
						initial={{ opacity: 0 }}
						animate={{
							opacity: hoveredItem === "map" ? 1 : 0,
							transition: { duration: 0.3 },
						}}
					>
						<div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
					</motion.div>

					{/* Loading indicator */}
					{!mapLoaded && (
						<div className="absolute inset-0 z-30 flex items-center justify-center bg-zinc-900/80">
							<div className="flex space-x-2">
								{["dot-1", "dot-2", "dot-3"].map((dotKey, i) => (
									<motion.div
										key={dotKey}
										className="h-3 w-3 rounded-full bg-green-300"
										animate={{
											scale: [1, 1.5, 1],
											opacity: [0.3, 1, 0.3],
										}}
										transition={{
											duration: 1,
											repeat: Number.POSITIVE_INFINITY,
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
					className="relative mt-6 pl-6"
					initial={{ opacity: 0, y: 20 }}
					animate={{
						opacity: 1,
						y: 0,
						transition: { duration: 0.5, delay: 0.5 },
					}}
				>
					{/* Circle indicator */}
					<div className="-left-1 absolute top-0 text-green-300">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							className="h-6 w-6"
						>
							<path
								fill="currentColor"
								d="M6.72 16.64a1 1 0 1 1 .56 1.92c-.5.146-.86.3-1.091.44c.238.143.614.303 1.136.452C8.48 19.782 10.133 20 12 20s3.52-.218 4.675-.548c.523-.149.898-.309 1.136-.452c-.23-.14-.59-.294-1.09-.44a1 1 0 0 1 .559-1.92c.668.195 1.28.445 1.75.766c.435.299.97.82.97 1.594c0 .783-.548 1.308-.99 1.607c-.478.322-1.103.573-1.786.768C15.846 21.77 14 22 12 22s-3.846-.23-5.224-.625c-.683-.195-1.308-.446-1.786-.768c-.442-.3-.99-.824-.99-1.607c0-.774.535-1.295.97-1.594c.47-.321 1.082-.571 1.75-.766M12 7.5c-1.54 0-2.502 1.667-1.732 3c.357.619 1.017 1 1.732 1c1.54 0 2.502-1.667 1.732-3A2 2 0 0 0 12 7.5"
							/>
							<path
								fill="currentColor"
								d="M12 2a7.5 7.5 0 0 1 7.5 7.5c0 2.568-1.4 4.656-2.85 6.14a16.4 16.4 0 0 1-1.853 1.615c-.594.446-1.952 1.282-1.952 1.282a1.71 1.71 0 0 1-1.69 0a21 21 0 0 1-1.952-1.282A16.4 16.4 0 0 1 7.35 15.64C5.9 14.156 4.5 12.068 4.5 9.5A7.5 7.5 0 0 1 12 2"
								opacity="0.3"
							/>
						</svg>
					</div>

					<motion.h2 className="font-medium text-green-300 text-xl">
						Kolkata, West Bengal, India
					</motion.h2>

					<motion.p
						className="mt-2 text-zinc-400"
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
