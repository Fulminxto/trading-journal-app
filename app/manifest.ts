import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "VOLTIS",
        short_name: "VOLTIS",
        description:
            "Performance Operating System for disciplined traders.",
        start_url: "/accounts",
        scope: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#0C1430",
        theme_color: "#0C1430",
        categories: [
            "finance",
            "productivity",
            "business",
        ],
        icons: [
            {
                src: "/icons/variants/classic/icon-256.png",
                sizes: "256x256",
                type: "image/png",
                purpose: "any",
            },
            {
                src: "/icons/variants/classic/icon-512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "any",
            },
            {
                // no dedicated maskable yet — same 512 file used as fallback
                src: "/icons/variants/classic/icon-512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable",
            },
        ],
    };
}