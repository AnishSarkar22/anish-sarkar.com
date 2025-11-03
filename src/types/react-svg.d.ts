// import * as React from "react";

declare module "react" {
	// Augment React's SVGProps to allow a `size` prop
	interface SVGProps<_T> {
		size?: number;
	}
}
