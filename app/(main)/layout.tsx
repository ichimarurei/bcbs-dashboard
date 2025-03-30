import { Metadata } from 'next';
import Layout from '../../layout/layout';

interface AppLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: 'Baitul Mal Cicurug Bata',
    description: 'Baitul Mal Cicurug Bata Tasikmalaya.',
    robots: { index: false, follow: false },
    viewport: { initialScale: 1, width: 'device-width' },
    openGraph: {
        type: 'website',
        title: 'Baitul Mal Cicurug Bata',
        url: 'https://bcbs-dashboard-v2.vercel.app/',
        description: 'Baitul Mal Cicurug Bata Tasikmalaya.',
        images: [],
        ttl: 604800
    },
    icons: {
        icon: '/favicon.ico'
    }
};

export default function AppLayout({ children }: AppLayoutProps) {
    return <Layout>{children}</Layout>;
}
