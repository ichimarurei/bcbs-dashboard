/* eslint-disable @next/next/no-img-element */
'use client';

import { LayoutContext } from '@/layout/context/layoutcontext';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import { useContext, useState } from 'react';

const LoginPage = () => {
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const { layoutConfig } = useContext(LayoutContext);

    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Logo" className="mb-5 w-6rem flex-shrink-0" />
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <img src="/layout/images/bcbs.jpg" alt="Image" height="200" className="mb-3 border-round-2xl" />
                            <div className="text-900 text-3xl font-medium mb-3">Baitul Mal Cicurug Bata</div>
                            <span className="text-600 font-medium">Admin Dashboard Panel System</span>
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

                            <div className="flex align-items-center justify-content-between mb-5 gap-5"></div>
                            <Button label="Akses" className="w-full p-3 text-xl" onClick={() => router.push('/')}></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
