"use client";

import { useEffect } from "react";
import {
    usePathname,
    useSearchParams,
} from "next/navigation";

export default function SettingsHardRefresh() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const shouldRefresh =
            pathname === "/settings" &&
            searchParams.has("refresh") &&
            !searchParams.has("reloaded");

        if (!shouldRefresh) {
            return;
        }

        const timeout = window.setTimeout(() => {
            window.location.replace(
                "/settings?toast=success&reloaded=true"
            );
        }, 150);

        return () => {
            window.clearTimeout(timeout);
        };
    }, [pathname, searchParams]);

    return null;
}