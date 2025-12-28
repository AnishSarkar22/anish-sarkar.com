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
					className="mt-6"
					initial={{ opacity: 0, y: 20 }}
					animate={{
						opacity: 1,
						y: 0,
						transition: { duration: 0.5, delay: 0.5 },
					}}
				>
					{/* Location heading with icon */}
					<div className="flex items-center gap-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 14 14"
							role="img"
							aria-labelledby="locationTitle"
						>
							<title id="locationTitle">Location</title>
							<g fill="none">
								<path
									fill="#8fbffa"
									d="M7 .25c-2.092 0-3.797.59-4.979 1.771S.25 4.908.25 7s.59 3.797 1.771 4.979S4.908 13.75 7 13.75s3.797-.59 4.979-1.771S13.75 9.092 13.75 7s-.59-3.797-1.771-4.979S9.092.25 7 .25"
								/>
								<path
									fill="#2859c5"
									fillRule="evenodd"
									d="M8.576 4.332a1.043 1.043 0 0 1 1.092 1.093C9.6 7 8.926 8.655 8.023 10.187a.73.73 0 0 1-.761.348a.79.79 0 0 1-.631-.55a9 9 0 0 0-.375-1.017c-.149-.326-.308-.591-.47-.753s-.428-.322-.754-.47a9 9 0 0 0-1.017-.375a.79.79 0 0 1-.55-.631a.73.73 0 0 1 .35-.761C5.344 5.074 7 4.4 8.575 4.332Z"
									clipRule="evenodd"
								/>
							</g>
						</svg>
						<motion.h2 className="font-medium text-white text-xl">
							Kolkata, West Bengal, India
						</motion.h2>
					</div>

					<motion.p
						className="mt-2 pl-[26px] text-zinc-400"
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
