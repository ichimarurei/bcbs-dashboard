/* eslint-disable @next/next/no-img-element */

import { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <div className="layout-footer">
            <img src={`/images/layout/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Logo" height="20" className="mr-2" />
            version
            <span className="font-medium ml-2">2.0</span>
        </div>
    );
};

export default AppFooter;
