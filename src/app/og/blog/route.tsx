import { ImageResponse } from "next/og";

export const runtime = "edge";

async function loadGoogleFont(font: string, text: string) {
	try {
		// Simplify text before loading fonts
		const simplifiedText = text
			.replace(/[^\w\s.,?!:;()\[\]{}<>'"]/g, "") // Keep only basic characters
			.substring(0, 100); // Length limit

		const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(
			simplifiedText,
		)}`;

		const css = await (await fetch(url)).text();
		const resource = css.match(
			/src: url\((.+)\) format\('(opentype|truetype)'\)/,
		);

		if (resource?.[1]) {
			const response = await fetch(resource[1]);
			if (response.status === 200) {
				return await response.arrayBuffer();
			}
		}

		// Returns null if font not found
		return null;
	} catch (error) {
		console.error("Font loading error:", error);
		return null;
	}
}

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);

		// URL decoding of parameters
		const encodedTitle = searchParams.get("title");
		const encodedTop = searchParams.get("top");

		// URL decoding with safe handling
		const title = encodedTitle
			? decodeURIComponent(encodedTitle)
			: "anish's blog";
		const top = encodedTop ? decodeURIComponent(encodedTop) : "";

		// Handle long titles and remove special characters if necessary
		const processedTitle =
			title.length > 60 ? `${title.substring(0, 57)}...` : title;

		// Load additional fonts for title and content with error handling
		let fontData: ArrayBuffer | null;
		let fontDataBold: ArrayBuffer | null;
		try {
			fontData = await loadGoogleFont("Geist+Mono", "anish's tech blog");
			fontDataBold = await loadGoogleFont(
				"Inter:wght@700",
				"anish's tech blog",
			);
		} catch (error) {
			console.error("Font loading error:", error);
			fontData = null;
			fontDataBold = null;
		}

		// Font list with null handling
		const fonts = [];
		if (fontData) {
			fonts.push({
				name: "Geist Mono",
				data: fontData,
				style: "normal" as const,
			});
		}

		if (fontDataBold) {
			fonts.push({
				name: "Inter",
				data: fontDataBold,
				style: "normal" as const,
				weight: 700 as const,
			});
		}

		return new ImageResponse(
			<div
				style={{
					height: "100%",
					width: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					background:
						"linear-gradient(125deg, #0f172a 0%, #111827 40%, #0f172a 80%, #0c1222 100%)",
					fontFamily: fonts.length > 0 ? "Geist Mono" : "sans-serif",
					padding: "40px",
					position: "relative",
					overflow: "hidden",
				}}
			>
				{/* Upgraded background effects */}
				<div
					style={{
						position: "absolute",
						inset: 0,
						backgroundImage: `
                linear-gradient(to right, rgba(52, 211, 153, 0.05) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(52, 211, 153, 0.05) 1px, transparent 1px)
              `,
						backgroundSize: "40px 40px",
						opacity: 0.3,
					}}
				/>

				{/* Layered lighting effect */}
				<div
					style={{
						position: "absolute",
						width: "800px",
						height: "800px",
						borderRadius: "50%",
						background:
							"radial-gradient(circle, rgba(52, 211, 153, 0.15) 0%, transparent 70%)",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						opacity: 0.6,
						filter: "blur(60px)",
					}}
				/>

				{/* Advanced Blog Badge */}
				{/* <div
            style={{
              position: "absolute",
              top: "40px",
              left: "40px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 20px",
              borderRadius: "30px",
              background: "rgba(15, 23, 42, 0.6)",
              border: "1px solid rgba(52, 211, 153, 0.3)",
              boxShadow:
                "0 4px 12px rgba(0, 0, 0, 0.2), 0 0 15px rgba(52, 211, 153, 0.2)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: "#86efac",
                boxShadow: "0 0 10px rgba(134, 239, 172, 0.8)",
                position: "relative",
                display: "flex",
              }}
            />
            <span
              style={{
                fontSize: 18,
                color: "#e2e8f0",
                fontWeight: "600",
                textShadow: "0 0 5px rgba(226, 232, 240, 0.3)",
              }}
            >
              blog
            </span>
          </div> */}

				{/* Advanced Author Badge */}
				<div
					style={{
						position: "absolute",
						top: "40px",
						right: "40px",
						display: "flex",
						alignItems: "center",
						gap: "10px",
						padding: "10px 20px",
						borderRadius: "30px",
						background: "rgba(15, 23, 42, 0.6)",
						border: "1px solid rgba(168, 85, 247, 0.3)",
						boxShadow:
							"0 4px 12px rgba(0, 0, 0, 0.2), 0 0 15px rgba(168, 85, 247, 0.2)",
						backdropFilter: "blur(10px)",
					}}
				>
					<span
						style={{
							fontSize: 18,
							color: "#e2e8f0",
							fontWeight: "600",
							textShadow: "0 0 5px rgba(226, 232, 240, 0.3)",
						}}
					>
						@AnishSarkar22
					</span>
				</div>

				{/* Advanced content container with glass effect */}
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-start",
						justifyContent: "center",
						padding: "50px",
						borderRadius: "30px",
						background: "rgba(15, 23, 42, 0.5)",
						border: "1px solid rgba(52, 211, 153, 0.2)",
						boxShadow:
							"0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(52, 211, 153, 0.1)",
						backdropFilter: "blur(10px)",
						width: "80%",
						maxWidth: "900px",
						position: "relative",
						overflow: "hidden",
					}}
				>
					{/* Advanced Title Container */}
					<div
						style={{
							display: "flex",
							alignItems: "flex-start",
							gap: "20px",
							width: "100%",
							position: "relative",
						}}
					>
						{/* Advanced prefix symbols */}
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								width: "70px",
								height: "70px",
								borderRadius: "16px",
								background:
									"linear-gradient(135deg, rgba(52, 211, 153, 0.2), rgba(16, 185, 129, 0.1))",
								border: "1px solid rgba(52, 211, 153, 0.3)",
								boxShadow:
									"0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 0 15px rgba(52, 211, 153, 0.2)",
								flexShrink: 0,
								position: "relative",
								overflow: "hidden",
							}}
						>
							<span
								style={{
									color: "#86efac",
									fontSize: 40,
									fontWeight: "bold",
									textShadow: "0 0 10px rgba(134, 239, 172, 0.7)",
									position: "relative",
								}}
							>
								&gt;
							</span>
						</div>

						{/* Advanced Title */}
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								gap: "10px",
								width: "90%",
								flexGrow: 1,
							}}
						>
							<h1
								style={{
									fontSize: title.length > 40 ? 36 : 48,
									fontWeight: "bold",
									color: "#f9fafb",
									margin: 0,
									lineHeight: 1.2,
									wordBreak: "break-word",
									overflowWrap: "break-word",
									width: "100%",
									textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
									display: "-webkit-box",
									WebkitLineClamp: 3,
									WebkitBoxOrient: "vertical",
									overflow: "hidden",
									textOverflow: "ellipsis",
									fontFamily: fonts.length > 1 ? "Inter" : "sans-serif",
								}}
							>
								{processedTitle}
							</h1>

							{/* Advanced decorative underlining */}
							<div
								style={{
									height: "3px",
									width: "100%",
									background:
										"linear-gradient(to right, rgba(52, 211, 153, 0), rgba(52, 211, 153, 0.8), rgba(6, 182, 212, 0.6), rgba(52, 211, 153, 0))",
									borderRadius: "3px",
									boxShadow: "0 0 10px rgba(52, 211, 153, 0.5)",
								}}
							/>

							{/* Add sub description */}
							<p
								style={{
									fontSize: 20,
									color: "#a5b4fc",
									margin: 0,
									opacity: 0.9,
									textShadow: "0 0 5px rgba(165, 180, 252, 0.3)",
								}}
							>
								bridge knowledge with real-world experience
							</p>
						</div>
					</div>
				</div>

				{/* Advanced date badge */}
				{top && (
					<div
						style={{
							position: "absolute",
							bottom: "40px",
							left: "40px",
							display: "flex",
							alignItems: "center",
							gap: "10px",
							padding: "10px 20px",
							borderRadius: "30px",
							background: "rgba(15, 23, 42, 0.6)",
							border: "1px solid rgba(6, 182, 212, 0.3)",
							boxShadow:
								"0 4px 12px rgba(0, 0, 0, 0.2), 0 0 15px rgba(6, 182, 212, 0.2)",
							backdropFilter: "blur(10px)",
						}}
					>
						<span
							style={{
								fontSize: 18,
								color: "#e2e8f0",
								fontWeight: "600",
								textShadow: "0 0 5px rgba(226, 232, 240, 0.3)",
							}}
						>
							{top}
						</span>
					</div>
				)}
			</div>,
			{
				width: 1200,
				height: 630,
				fonts: fonts,
			},
		);
	} catch (error) {
		console.error("OG Image generation error:", error);

		// Return simple image if error
		return new ImageResponse(
			<div
				style={{
					height: "100%",
					width: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					background: "#0f172a",
					color: "white",
					fontFamily: "sans-serif",
					padding: "40px",
				}}
			>
				<h1 style={{ fontSize: 60, textAlign: "center" }}>anish's blog</h1>
			</div>,
			{
				width: 1200,
				height: 630,
			},
		);
	}
}
