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
                <meta name="theme-color" content="#6366F1" />
                <meta name="viewport" content="initial-scale=1, viewport-fit=cover, width=device-width"></meta>
                <link id="theme-css" href={`/themes/lara-dark-purple/theme.css`} rel="stylesheet"></link>
                <link rel="manifest" href="/manifest.json" />
                <link rel="apple-touch-icon" href="/images/layout/icon-192x192.jpg" />
            </head>
            <body>
                <PrimeReactProvider>
                    <LayoutProvider>{children}</LayoutProvider>
                </PrimeReactProvider>
            </body>
        </html>
    );
}
