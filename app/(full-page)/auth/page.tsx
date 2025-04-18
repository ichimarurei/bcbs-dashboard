/* eslint-disable @next/next/no-img-element */
'use client';

import { LayoutContext } from '@/layout/context/layoutcontext';
import { isEmpty } from 'lodash';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { useContext, useEffect, useRef, useState } from 'react';

const LoginPage = () => {
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [isLoad, setLoad] = useState(false);
    const [showInstallLink, setShowInstallLink] = useState(false);
    const [prompt, setPrompt] = useState<any>(null);
    const { layoutConfig } = useContext(LayoutContext);

    const router = useRouter();
    const toast = useRef<Toast>(null);
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const doSign = async () => {
        let showToast = false;
        let detail = '';

        try {
            if (isEmpty(phone)) {
                showToast = true;
                detail = 'Nomor telepon tidak boleh kosong';
            }

            if (!showToast && isEmpty(password)) {
                showToast = true;
                detail = 'Kata sandi tidak boleh kosong';
            }

            if (!showToast) {
                const response = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone, password }) });
                const result = await response.json();

                if (!response.ok) {
                    toast.current?.show({
                        life: 3000,
                        severity: 'error',
                        summary: 'Akses ditolak!',
                        detail: result?.error
                    });
                } else {
                    delete result?.password;
                    delete result?.id;
                    delete result?._id;
                    sessionStorage.setItem('bcbs-session', JSON.stringify(result));
                    router.push('/dashboard');
                }
            } else {
                toast.current?.show({
                    life: 3000,
                    severity: 'warn',
                    summary: 'Validasi gagal!',
                    detail
                });
            }
        } catch (_) {}

        setLoad(false);
    };

    useEffect(() => {
        if (sessionStorage.getItem('bcbs-session')) {
            router.push('/dashboard');
        }
    }, [router]);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setPrompt(e);

            if (!window.matchMedia('(display-mode: standalone)').matches) {
                setShowInstallLink(true);
            }
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`/images/layout/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Logo" className="mb-5 w-6rem flex-shrink-0" />
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <Toast ref={toast} />

                        <div className="text-center mb-5">
                            <img src="/images/layout/bcbs.png" alt="Image" height="170" className="mb-3 border-round-2xl" />
                            <div className="text-900 text-3xl font-medium mb-3">Dashboard BCBS</div>
                            <span className="text-600 font-medium">Baitul Mal | Cicurug Bata</span>
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-900 text-xl font-medium mb-2">
                                Telepon
                            </label>
                            <InputText id="phone" type="tel" placeholder="Nomor Telepon" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} value={phone} onChange={(e) => setPhone(e.target.value)} />

                            <label htmlFor="password" className="block text-900 font-medium text-xl mb-2">
                                Sandi
                            </label>
                            <Password inputId="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Kata Sandi" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem"></Password>

                            {showInstallLink && (
                                <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                    <a
                                        className="font-medium no-underline ml-2 text-right cursor-pointer"
                                        style={{ color: 'var(--primary-color)' }}
                                        onClick={() => {
                                            if (prompt) {
                                                prompt.prompt();
                                                prompt.useChoice.then((_: any) => {
                                                    setPrompt(null);
                                                });
                                            }
                                        }}
                                    >
                                        Install Web App
                                    </a>
                                </div>
                            )}

                            <div className="flex align-items-center justify-content-between mb-5 gap-5"></div>
                            {!isLoad && (
                                <Button
                                    label="Akses"
                                    className="w-full p-3 text-xl"
                                    onClick={async () => {
                                        setLoad(true);
                                        await doSign();
                                    }}
                                />
                            )}
                            {isLoad && (
                                <Button
                                    label="Proses..."
                                    className="w-full p-3 text-xl"
                                    onClick={() => {
                                        toast.current?.show({
                                            life: 3000,
                                            severity: 'info',
                                            summary: 'Info',
                                            detail: 'Masih memproses otentikasi hak akses Anda...'
                                        });
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
