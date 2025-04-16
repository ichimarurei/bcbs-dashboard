'use client';

import { secretCrypto } from '@/lib/constant';
import { IAdmin } from '@/models/admin';
import { AES, enc } from 'crypto-js';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface TypeItem {
    name: string;
    code: string;
}

const FormAdmin = ({ params }: { params: Promise<{ slug: string }> }) => {
    const [typeItem, setTypeItem] = useState<TypeItem | null>(null);
    const [action, setAction] = useState('baru');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [active, setActive] = useState(true);
    const [isLoad, setLoad] = useState(false);

    const router = useRouter();
    const toast = useRef<Toast>(null);

    const typesItems: TypeItem[] = useMemo(
        () => [
            { code: 'root', name: 'DEVELOPER' },
            { code: 'admin', name: 'PENGURUS' }
        ],
        []
    );

    const fetching = useCallback(
        async (id: string) => {
            try {
                const response = await fetch(`/api/admin/${id}`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
                const admin: IAdmin = await response.json();
                console.log(admin);

                if (admin) {
                    setAction(admin.id);
                    setName(admin.name);
                    setPhone(admin.phone);
                    setActive(admin.status);
                    setPassword(AES.decrypt(admin.password, secretCrypto).toString(enc.Utf8));
                    setTypeItem(typesItems.find((item) => item.code === admin.type) || typesItems[0]);
                }
            } catch (_) {
                toast.current?.show({
                    life: 3000,
                    severity: 'warn',
                    summary: 'Gagal memuat!',
                    detail: 'Data tidak dapat diambil atau tidak ditemukan'
                });
            }
        },
        [typesItems]
    );

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
                    <h5>{action === 'baru' ? 'Tambah' : 'Ubah'} Profil Admin</h5>
                    <div className="p-fluid">
                        <div className="field">
                            <label htmlFor="name">Nama</label>
                            <InputText id="name" type="text" placeholder="Nama admin" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="field">
                            <label htmlFor="phone">No Telepon</label>
                            <InputText id="phone" type="tel" placeholder="No telepon admin" value={phone} onChange={(e) => setPhone(e.target.value)} />
                        </div>
                        <div className="field">
                            <label htmlFor="password">Sandi</label>
                            <InputText id="password" type="password" placeholder="Kata sandi akun admin" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="field">
                            <label htmlFor="type">Otoritas</label>
                            <Dropdown id="type" value={typeItem ?? typesItems.at(0)} onChange={(e) => setTypeItem(e.value)} options={typesItems} optionLabel="name" placeholder="Hak akses admin" />
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
                                    const response = await fetch('/api/admin', { method: 'POST', body: JSON.stringify({ action, name, phone, password, status: active, type: typeItem?.code }), headers: { 'Content-Type': 'application/json' } });
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

export default FormAdmin;
