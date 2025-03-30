import { Metadata } from 'next';
import React from 'react';

interface SimpleLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: 'Baitul Mal Cicurug Bata',
    description: 'Baitul Mal Cicurug Bata Tasikmalaya.'
};

export default function SimpleLayout({ children }: SimpleLayoutProps) {
    return <React.Fragment>{children}</React.Fragment>;
}
