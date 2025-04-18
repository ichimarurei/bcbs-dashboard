'use client';

import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/primereact.css';
import { LayoutProvider } from '../layout/context/layoutcontext';
import '../styles/_custom.scss';
import '../styles/layout/layout.scss';

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <meta name="application-name" content="Baitul Mal Cicurug Bata" />
                <meta name="description" content="Baitul Mal Cicurug Bata Tasikmalaya" />
                <meta name="format-detection" content="telephone=no" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="msapplication-TileColor" content="#22C55E" />
                <meta name="msapplication-tap-highlight" content="no" />
                <meta name="theme-color" content="#6366F1" />

                <link rel="apple-touch-icon" href="/images/layout/icon-192x192.png" />
                <link rel="apple-touch-icon" sizes="192x192" href="/images/layout/icon-192x192.png" />
                <link rel="apple-touch-icon" sizes="512x512" href="/images/layout/icon-512x512.png" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="apple-mobile-web-app-title" content="Baitul Mal Cicurug Bata" />

                <link rel="icon" type="image/png" sizes="192x192" href="/images/layout/icon-192x192.png" />
                <link rel="icon" type="image/png" sizes="512x512" href="/images/layout/icon-512x512.png" />

                <meta name="twitter:card" content="BCBS" />
                <meta name="twitter:url" content="https://bcbs-dashboard-v2.vercel.app" />
                <meta name="twitter:title" content="Baitul Mal Cicurug Bata" />
                <meta name="twitter:description" content="Baitul Mal Cicurug Bata Tasikmalaya" />
                <meta name="twitter:image" content="https://bcbs-dashboard-v2.vercel.app/images/layout/icon-512x512.png" />
                <meta name="twitter:creator" content="jms21maru@gmail.com" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Baitul Mal Cicurug Bata" />
                <meta property="og:description" content="Baitul Mal Cicurug Bata Tasikmalaya" />
                <meta property="og:site_name" content="BCBS" />
                <meta property="og:url" content="https://bcbs-dashboard-v2.vercel.app" />
                <meta property="og:image" content="https://bcbs-dashboard-v2.vercel.app/images/layout/icon-512x512.png" />

                <meta name="viewport" content="initial-scale=1, viewport-fit=cover, width=device-width"></meta>
                <link rel="stylesheet" id="theme-css" href={`/themes/lara-dark-purple/theme.css`}></link>
                <link rel="manifest" href="/manifest.json" />
            </head>
            <body>
                <PrimeReactProvider>
                    <LayoutProvider>{children}</LayoutProvider>
                </PrimeReactProvider>
            </body>
        </html>
    );
}
