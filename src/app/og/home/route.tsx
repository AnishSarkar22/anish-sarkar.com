import { ImageResponse } from "next/og";
export const runtime = "edge";

async function loadGoogleFont(font: string, text: string) {
	const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(
		text,
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

	throw new Error("failed to load font data");
}

export async function GET(request: Request) {
	const url = new URL(request.url);
	const siteUrl = `${url.protocol}//${url.host}`;
	const { searchParams } = url;
	const title = searchParams.get("title");
	const text = title ? `anish | ${title}` : "Anish Sarkar";

	// Download additional fonts for titles and content
	const fontData = await loadGoogleFont("Geist+Mono", text);
	const fontDataBold = await loadGoogleFont("Inter:wght@700", text);

	return new ImageResponse(
		<div
			style={{
				height: "100%",
				width: "100%",
				display: "flex",
				fontFamily: "Geist Mono",
				position: "relative",
				overflow: "hidden",
				background: "#0a0a0f",
			}}
		>
			{/* Background image */}
			<img
				src={`${siteUrl}/og-image.png`}
				alt=""
				width={1200}
				height={630}
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					objectFit: "cover",
					opacity: 0.6,
				}}
			/>

			{/* Colored gradient overlay to enhance the vibe */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					background:
						"linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, transparent 50%, rgba(139, 92, 246, 0.2) 100%)",
				}}
			/>

			{/* Main content - left aligned */}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "flex-start",
					justifyContent: "center",
					width: "100%",
					height: "100%",
					padding: "60px",
					gap: "24px",
				}}
			>
				{/* Name with glow effect */}
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-start",
						gap: "16px",
					}}
				>
					{/* whoami command */}
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							fontSize: 24,
							margin: 0,
							fontFamily: "Geist Mono",
							letterSpacing: "0.05em",
						}}
					>
						<span style={{ color: "#94a3b8" }}>$</span>
						<span style={{ color: "#ffffff", marginLeft: "8px" }}>whoami</span>
					</div>

					<h1
						style={{
							fontSize: 80,
							fontWeight: "bold",
							color: "#ffffff",
							margin: 0,
							lineHeight: 1,
							fontFamily: "Inter",
							letterSpacing: "-0.03em",
							textShadow:
								"0 0 60px rgba(59, 130, 246, 0.5), 0 0 120px rgba(139, 92, 246, 0.3)",
						}}
					>
						{text}
					</h1>

					{/* Accent line under name */}
					<div
						style={{
							width: "300px",
							height: "3px",
							background: "linear-gradient(to right, #60a5fa, #a78bfa, #34d399)",
							borderRadius: "2px",
							boxShadow: "0 0 30px rgba(96, 165, 250, 0.8), 0 0 60px rgba(167, 139, 250, 0.4)",
							marginTop: "4px",
						}}
					/>

					<p
						style={{
							fontSize: 24,
							color: "#cbd5e1",
							margin: 0,
							fontFamily: "Geist Mono",
							letterSpacing: "0.15em",
							textTransform: "uppercase",
							fontWeight: 500,
							opacity: 0.9,
							textShadow: "0 0 20px rgba(203, 213, 225, 0.3)",
						}}
					>
						Software Developer
					</p>
				</div>
			</div>
		</div>,
		{
			width: 1200,
			height: 630,
			fonts: [
				{
					name: "Geist Mono",
					data: fontData,
					style: "normal",
				},
				{
					name: "Inter",
					data: fontDataBold,
					style: "normal",
					weight: 700,
				},
			],
		},
	);
}
