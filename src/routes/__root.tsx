import type { QueryClient } from "@tanstack/react-query"
import { createRootRouteWithContext } from "@tanstack/react-router"
import { HeadContent, Outlet, Scripts } from "@tanstack/react-router"
import type { ReactNode } from "react"

import { ThemeScript } from "@/components/theme-script"
import { auth } from "@/lib/auth"
import globals_css from "@/styles/globals.css?url"
import { createServerFn } from "@tanstack/react-start"
import { getHeaders } from "@tanstack/react-start/server"
import { Providers } from "../providers"

// Configurable site metadata
const SITE_TITLE = "intern3.chat"
const SITE_DESCRIPTION = "Powerful AI chatbot. By interns, for interns."
const SITE_URL = "https://chat.lkwplus.com" // Update this to your actual domain

const getAccessToken = createServerFn().handler(async (ctx) => {
    const headers = await getHeaders()
    if (!headers) return null

    const headersObject = new Headers()
    for (const [key, value] of Object.entries(headers)) {
        if (value) {
            headersObject.set(key, value)
        }
    }
    const { token } = await auth.api.getToken({
        headers: headersObject
    })
    return token
})

export const Route = createRootRouteWithContext<{
    queryClient: QueryClient
}>()({
    head: () => ({
        meta: [
            {
                charSet: "utf-8"
            },
            {
                name: "viewport",
                content: "initial-scale=1, viewport-fit=contain, width=device-width"
            },
            {
                title: SITE_TITLE
            },
            {
                name: "description",
                content: SITE_DESCRIPTION
            },
            // Theme color meta tags
            {
                name: "theme-color",
                content: "oklch(1 0 0)",
                media: "(prefers-color-scheme: light)"
            },
            {
                name: "theme-color",
                content: "oklch(0.145 0 0)",
                media: "(prefers-color-scheme: dark)"
            },
            // Apple mobile web app
            {
                name: "apple-mobile-web-app-capable",
                content: "yes"
            },
            // Open Graph meta tags
            {
                property: "og:title",
                content: SITE_TITLE
            },
            {
                property: "og:description",
                content: SITE_DESCRIPTION
            },
            {
                property: "og:image",
                content: `${SITE_URL}/opengraph.jpg`
            },
            {
                property: "og:url",
                content: SITE_URL
            },
            {
                property: "og:type",
                content: "website"
            },
            {
                property: "og:site_name",
                content: SITE_TITLE
            },
            // Twitter Card meta tags
            {
                name: "twitter:card",
                content: "summary_large_image"
            },
            {
                name: "twitter:title",
                content: SITE_TITLE
            },
            {
                name: "twitter:description",
                content: SITE_DESCRIPTION
            },
            {
                name: "twitter:image",
                content: `${SITE_URL}/opengraph.jpg`
            }
        ],
        links: [
            { rel: "stylesheet", href: globals_css },
            { rel: "icon", href: "/favicon.ico" },
            { rel: "apple-touch-icon", href: "/apple-icon-180.png" },
            { rel: "manifest", href: "/manifest.webmanifest" },
            { rel: "preconnect", href: "https://fonts.googleapis.com" },
            {
                rel: "preconnect",
                href: "https://fonts.gstatic.com",
                crossOrigin: "anonymous"
            },
            {
                rel: "stylesheet",
                href: "https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&family=Geist:wght@100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Merriweather:ital,opsz,wght@0,18..144,300..900;1,18..144,300..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Outfit:wght@100..900&family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&display=swap"
            }
        ]
    }),

    component: RootComponent
})

function RootComponent() {
    return (
        <RootDocument>
            <Outlet />
        </RootDocument>
    )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <ThemeScript />
                <HeadContent />
            </head>

            <body className="h-dvh overflow-hidden">
                <Providers>{children}</Providers>

                <Scripts />
            </body>
        </html>
    )
}
