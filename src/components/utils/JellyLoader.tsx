// Using Jelly Loader from LDRS library
"use client";
import { Jelly } from "ldrs/react";
import "ldrs/react/Jelly.css";

export default function BouncyLoader() {
	return (
		<div className="flex items-center justify-center p-4" aria-hidden="true">
			<Jelly size="120" speed="0.9" color="#83E4A6" />
		</div>
	);
}
