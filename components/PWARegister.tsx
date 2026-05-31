"use client";

import { useEffect } from "react";

export default function PWARegister() {
    useEffect(() => {
        if (process.env.NODE_ENV !== "production") {
            return;
        }

        if (!("serviceWorker" in navigator)) {
            return;
        }

        const registerServiceWorker = async () => {
            try {
                await navigator.serviceWorker.register("/sw.js");
            } catch {
                // Non blocchiamo l'app se la registrazione fallisce
            }
        };

        window.addEventListener("load", registerServiceWorker);

        return () => {
            window.removeEventListener("load", registerServiceWorker);
        };
    }, []);

    return null;
}