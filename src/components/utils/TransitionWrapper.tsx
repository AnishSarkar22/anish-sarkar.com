"use client";

import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
// removed: import "~/styles/transition.css";

interface TransitionWrapperProps {
    children: ReactNode;
}

export default function TransitionWrapper({ children }: TransitionWrapperProps) {
    const pathname = usePathname();
    // use the pathname as a key so children remount on route change (very lightweight)
    const [key, setKey] = useState(pathname);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setKey(pathname);
    }, [pathname]);

    // trigger fade-in on remount
    useEffect(() => {
        // ensure start from hidden then fade in
        setVisible(false);
        const t = setTimeout(() => setVisible(true), 20);
        return () => clearTimeout(t);
    }, []);

    return (
        <div
            key={key}
            className="transition-content"
            style={{
                opacity: visible ? 1 : 0,
                transition: "opacity 200ms ease",
            }}
        >
            {children}
        </div>
    );
}
