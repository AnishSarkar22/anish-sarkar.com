import { ImageResponse } from "next/og";
export const runtime = "edge";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

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
	const { searchParams } = new URL(request.url);
	const title = searchParams.get("title");
	const text = title ? `anish | ${title}` : "anish | home";

	// Download additional fonts for titles and content
	const fontData = await loadGoogleFont("Geist+Mono", text);
	const fontDataBold = await loadGoogleFont("Inter:wght@700", text);

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
				fontFamily: "Geist Mono",
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

			<div
				style={{
					position: "absolute",
					width: "600px",
					height: "600px",
					borderRadius: "50%",
					background:
						"radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)",
					top: "30%",
					left: "30%",
					transform: "translate(-50%, -50%)",
					opacity: 0.5,
					filter: "blur(50px)",
				}}
			/>

			<div
				style={{
					position: "absolute",
					width: "400px",
					height: "400px",
					borderRadius: "50%",
					background:
						"radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%)",
					bottom: "20%",
					right: "20%",
					opacity: 0.4,
					filter: "blur(40px)",
				}}
			/>

			{/* Advanced light effects */}
			<div
				style={{
					position: "absolute",
					width: "100%",
					height: "3px",
					background:
						"linear-gradient(to right, transparent, rgba(52, 211, 153, 0.6), transparent)",
					top: "30%",
					opacity: 0.5,
					filter: "blur(1px)",
				}}
			/>

			<div
				style={{
					position: "absolute",
					width: "3px",
					height: "100%",
					background:
						"linear-gradient(to bottom, transparent, rgba(52, 211, 153, 0.4), transparent)",
					left: "25%",
					opacity: 0.4,
					filter: "blur(1px)",
				}}
			/>

			{/* Cross light effect */}
			<div
				style={{
					position: "absolute",
					width: "150%",
					height: "3px",
					background:
						"linear-gradient(to right, transparent, rgba(52, 211, 153, 0.3), transparent)",
					top: "65%",
					left: "-25%",
					transform: "rotate(-30deg)",
					opacity: 0.3,
					filter: "blur(1px)",
				}}
			/>

			<div
				style={{
					position: "absolute",
					width: "150%",
					height: "2px",
					background:
						"linear-gradient(to right, transparent, rgba(6, 182, 212, 0.3), transparent)",
					top: "40%",
					right: "-25%",
					transform: "rotate(25deg)",
					opacity: 0.3,
					filter: "blur(1px)",
				}}
			/>

			{/* Geometric effect */}
			<div
				style={{
					position: "absolute",
					width: "200px",
					height: "200px",
					border: "1px solid rgba(52, 211, 153, 0.1)",
					borderRadius: "30px",
					top: "15%",
					left: "10%",
					transform: "rotate(15deg)",
					opacity: 0.4,
				}}
			/>

			<div
				style={{
					position: "absolute",
					width: "150px",
					height: "150px",
					border: "1px solid rgba(52, 211, 153, 0.1)",
					borderRadius: "50%",
					bottom: "15%",
					right: "10%",
					opacity: 0.3,
				}}
			/>

			{/* Advanced content container with glass effect */}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					padding: "50px",
					borderRadius: "30px",
					background: "rgba(15, 23, 42, 0.5)",
					border: "1px solid rgba(52, 211, 153, 0.2)",
					boxShadow:
						"0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(52, 211, 153, 0.1)",
					backdropFilter: "blur(10px)",
					maxWidth: "80%",
					position: "relative",
					overflow: "hidden",
				}}
			>
				{/* Sparkling light effect */}
				<div
					style={{
						position: "absolute",
						top: 0,
						left: "-100%",
						width: "150%",
						height: "100%",
						background:
							"linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)",
						transform: "skewX(-15deg)",
						opacity: 0.7,
					}}
				/>

				{/* Bright Edge Effect */}
				<div
					style={{
						position: "absolute",
						inset: 0,
						borderRadius: "30px",
						padding: "1px",
						background:
							"linear-gradient(135deg, rgba(52, 211, 153, 0.3), rgba(6, 182, 212, 0.1), rgba(52, 211, 153, 0.3))",
						WebkitMask:
							"linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
						WebkitMaskComposite: "xor",
						maskComposite: "exclude",
						pointerEvents: "none",
					}}
				/>

				{/* Advanced Header Container */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "20px",
						maxWidth: "100%",
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
						{/* Interior lighting effects */}
						<div
							style={{
								position: "absolute",
								inset: 0,
								background:
									"radial-gradient(circle at 30% 30%, rgba(52, 211, 153, 0.2), transparent 70%)",
							}}
						/>

						<span
							style={{
								color: "#86efac",
								fontSize: 40,
								fontWeight: "bold",
								textShadow: "0 0 10px rgba(134, 239, 172, 0.7)",
								position: "relative",
							}}
						/>
					</div>

					{/* Advanced Title */}
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: "10px",
						}}
					>
						<h1
							style={{
								fontSize: 60,
								fontWeight: "bold",
								background:
									"linear-gradient(to right, #f9fafb, #e5e7eb, #a5f3fc)",
								backgroundClip: "text",
								color: "transparent",
								margin: 0,
								lineHeight: 1.1,
								wordBreak: "break-word",
								overflowWrap: "break-word",
								maxWidth: "100%",
								textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
								fontFamily: "Inter",
							}}
						>
							{text}
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

						{/* Advanced subtitles */}
						<p
							style={{
								fontSize: 20,
								color: "#a5b4fc",
								margin: 0,
								opacity: 0.9,
								textShadow: "0 0 5px rgba(165, 180, 252, 0.3)",
							}}
						>
							backend developer and AIML enthusiast
						</p>
					</div>
				</div>
			</div>

			{/* Enhanced profile picture with decorative elements */}
			{/* <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "120px",
            height: "120px",
          }}
        >

          <div
            style={{
              position: "absolute",
              width: "140px",
              height: "140px",
              borderRadius: "50%",
              border: "2px dashed rgba(52, 211, 153, 0.4)",
              opacity: 0.7,
            }}
          />
          

          <div
            style={{
              position: "absolute",
              width: "130px",
              height: "130px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(52, 211, 153, 0.5), rgba(6, 182, 212, 0.3))",
              opacity: 0.5,
            }}
          />
          

          <div
            style={{
              position: "absolute",
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              boxShadow: "0 0 25px rgba(52, 211, 153, 0.6)",
              opacity: 0.8,
            }}
          />
          

          <img
            src={`${siteUrl}/mine.png`}
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              border: "3px solid rgba(52, 211, 153, 0.7)",
              objectFit: "cover",
              zIndex: 10,
              boxShadow: "0 0 15px rgba(0, 0, 0, 0.3)",
            }}
          />
          

          <div
            style={{
              position: "absolute",
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255, 255, 255, 0.8), transparent 70%)",
              top: "15px",
              right: "25px",
              opacity: 0.6,
              zIndex: 11,
            }}
          />
        </div> */}

			{/* Advanced decorative badges */}
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
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2), 0 0 15px rgba(52, 211, 153, 0.2)",
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
          >
            <div
              style={{
                position: "absolute",
                inset: "-3px",
                borderRadius: "50%",
                border: "1px solid rgba(134, 239, 172, 0.5)",
                opacity: 0.7,
              }}
            />
          </div>
          <span
            style={{
              fontSize: 18,
              color: "#e2e8f0",
              fontWeight: "600",
              textShadow: "0 0 5px rgba(226, 232, 240, 0.3)",
            }}
          >
            online
          </span>
        </div> */}

			{/* Add information badge */}
			{/* <div
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
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2), 0 0 15px rgba(6, 182, 212, 0.2)",
            backdropFilter: "blur(10px)",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <span
            style={{
              fontSize: 18,
              color: "#e2e8f0",
              fontWeight: "600",
              textShadow: "0 0 5px rgba(226, 232, 240, 0.3)",
            }}
          >
            anish
          </span>
        </div> */}

			{/* Add badge to top right corner */}
			{/* <div
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
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2), 0 0 15px rgba(168, 85, 247, 0.2)",
            backdropFilter: "blur(10px)",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <span
            style={{
              fontSize: 18,
              color: "#e2e8f0",
              fontWeight: "600",
              textShadow: "0 0 5px rgba(226, 232, 240, 0.3)",
            }}
          >
            premium
          </span>
        </div> */}
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
