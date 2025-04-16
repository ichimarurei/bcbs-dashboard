'use client';

import { IAccount } from '@/models/account';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useCallback, useEffect, useRef, useState } from 'react';

const FormAccount = ({ params }: { params: Promise<{ slug: string }> }) => {
    const [action, setAction] = useState('baru');
    const [name, setName] = useState('');
    const [area, setArea] = useState('');
    const [number, setNumber] = useState('');
    const [active, setActive] = useState(true);
    const [isLoad, setLoad] = useState(false);

    const router = useRouter();
    const toast = useRef<Toast>(null);

    const fetching = useCallback(async (id: string) => {
        try {
            const response = await fetch(`/api/account/${id}`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
            const account: IAccount = await response.json();

            if (account) {
                setAction(account.id);
                setName(account.name);
                setArea(account.area);
                setActive(account.status);
                setNumber(account.number);
            }
        } catch (_) {
            toast.current?.show({
                life: 3000,
                severity: 'warn',
                summary: 'Gagal memuat!',
                detail: 'Data tidak dapat diambil atau tidak ditemukan'
            });
        }
    }, []);

    useEffect(() => {
        const setFormAction = async () => {
            try {
                const { slug } = await params;
                setAction(slug);
            } catch (_) {}
        };

        setFormAction();
    }, [params]);

    useEffect(() => {
        fetching(action);
    }, [action, fetching]);

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <h5>{action === 'baru' ? 'Tambah' : 'Ubah'} Profil Anggota</h5>
                    <div className="p-fluid">
                        <div className="field">
                            <label htmlFor="name">Nama</label>
                            <InputText id="name" type="text" placeholder="Nama anggota" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="field">
                            <label htmlFor="number">No Anggota</label>
                            <InputText id="number" type="text" placeholder="No anggota" value={number} onChange={(e) => setNumber(e.target.value)} />
                        </div>
                        <div className="field">
                            <label htmlFor="area">Area (RT)</label>
                            <InputText id="area" type="text" placeholder="Domisili/RT anggota" value={area} onChange={(e) => setArea(e.target.value)} />
                        </div>
                        <div className="field">
                            <label htmlFor="status" className={`text-${active ? 'green' : 'red'}-500`}>
                                Status {active ? 'AKTIF' : 'TIDAK AKTIF'}
                            </label>
                        </div>
                        <div className="field">
                            <InputSwitch id="status" checked={active} onChange={(e) => setActive(e.value)} />
                        </div>
                    </div>
                    <hr />
                    <div className="flex justify-content-between flex-wrap">
                        <Button label="Batal" icon="pi pi-times" severity="info" onClick={() => router.back()} />
                        {!isLoad && (
                            <Button
                                label="Simpan"
                                icon="pi pi-check"
                                className="form-action-button"
                                onClick={async () => {
                                    setLoad(true);
                                    const response = await fetch('/api/account', { method: 'POST', body: JSON.stringify({ action, name, number, area, status: active }), headers: { 'Content-Type': 'application/json' } });
                                    const result = await response.json();
                                    setLoad(false);

                                    if (result?.saved) {
                                        router.back();
                                    } else {
                                        toast.current?.show({
                                            life: 3000,
                                            severity: 'warn',
                                            summary: 'Gagal simpan!',
                                            detail: 'Data tidak dapat disimpan oleh Sistem'
                                        });
                                    }
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormAccount;
