/* eslint-disable @next/next/no-img-element */
import { AppMenuItem } from '@/types';
import AppMenuitem from './AppMenuitem';
import { MenuProvider } from './context/menucontext';

const AppMenu = () => {
    const model: AppMenuItem[] = [
        {
            label: 'Beranda',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-th-large', to: '/dashboard' }]
        },
        {
            label: 'Transaksi',
            items: [
                { label: 'Simpanan', icon: 'pi pi-fw pi-wallet', to: '/' },
                { label: 'Pinjaman', icon: 'pi pi-fw pi-credit-card', to: '/' },
                { label: 'Infaq', icon: 'pi pi-fw pi-money-bill', to: '/' },
                { label: 'Laporan', icon: 'pi pi-fw pi-file', to: '/' }
            ]
        },
        {
            label: 'Pengaturan',
            items: [
                { label: 'Pengurus', icon: 'pi pi-fw pi-user', to: '/admin', badge: 'NEW' },
                { label: 'Anggota', icon: 'pi pi-fw pi-users', to: '/account' },
                { label: 'Transparansi', icon: 'pi pi-fw pi-bookmark', to: '/money' }
            ]
        }
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
