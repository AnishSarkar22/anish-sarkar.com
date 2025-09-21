"use client";
import { Tooltip } from "react-tooltip";

export default function NavTooltips() {
	return (
		<>
			<Tooltip
				id="navbar-tooltip-home"
				place="top"
				effect="solid"
				offset={16}
				className="!z-[9999] !text-xs !rounded !bg-zinc-900 !text-green-200 !px-3 !py-1"
			/>
			<Tooltip
				id="navbar-tooltip-projects"
				place="top"
				effect="solid"
				offset={16}
				className="!z-[9999] !text-xs !rounded !bg-zinc-900 !text-green-200 !px-3 !py-1"
			/>
			<Tooltip
				id="navbar-tooltip-resume"
				place="top"
				effect="solid"
				offset={16}
				className="!z-[9999] !text-xs !rounded !bg-zinc-900 !text-green-200 !px-3 !py-1"
			/>
			{/* <Tooltip
        id="navbar-tooltip-blog"
        place="top"
        effect="solid"
        offset={16}
        className="!z-[9999] !text-xs !rounded !bg-zinc-900 !text-green-200 !px-3 !py-1"
      /> */}
			{/* <Tooltip
        id="navbar-tooltip-photos"
        place="top"
        effect="solid"
        offset={16}
        className="!z-[9999] !text-xs !rounded !bg-zinc-900 !text-green-200 !px-3 !py-1"
      /> */}
		</>
	);
}
