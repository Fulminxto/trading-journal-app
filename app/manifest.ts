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
        background_color: "#050b10",
        theme_color: "#050b10",
        categories: [
            "finance",
            "productivity",
            "business",
        ],
        icons: [
            {
                src: "/icons/voltis.svg",
                sizes: "any",
                type: "image/svg+xml",
                purpose: "maskable",
            },
        ],
    };
}