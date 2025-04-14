'use client';

import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import { useEffect, useMemo, useState } from 'react';

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

    const router = useRouter();

    const typesItems: TypeItem[] = useMemo(
        () => [
            { code: 'root', name: 'DEVELOPER' },
            { code: 'admin', name: 'PENGURUS' }
        ],
        []
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

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
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
                        <Button label="Simpan" icon="pi pi-check" className="form-action-button" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormAdmin;
