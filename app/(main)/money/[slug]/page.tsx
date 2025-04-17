'use client';

import { IBank } from '@/models/bank';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useEffect, useRef, useState } from 'react';

const FormBank = ({ params }: { params: Promise<{ slug: string }> }) => {
    const [action, setAction] = useState('');
    const [bank, setBank] = useState('');
    const [account, setAccount] = useState('');
    const [number, setNumber] = useState('');
    const [proof, setProof] = useState('');
    const [amount, setAmount] = useState(0);
    const [isLoad, setLoad] = useState(false);

    const router = useRouter();
    const toast = useRef<Toast>(null);

    const fetching = async (id: string) => {
        try {
            const response = await fetch(`/api/money/${id}`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
            const notes: IBank = await response.json();

            if (notes) {
                setAction(notes.id);
                setBank(notes.bank);
                setAccount(notes.account);
                setNumber(notes.number);
                setAmount(notes.amount);
                setProof(notes.proof || '');
            }
        } catch (_) {
            toast.current?.show({
                life: 3000,
                severity: 'warn',
                summary: 'Gagal memuat!',
                detail: 'Data tidak dapat diambil atau tidak ditemukan'
            });
        }
    };

    useEffect(() => {
        const setFormAction = async () => {
            try {
                const { slug } = await params;
                await fetching(slug);

                if (!slug || slug === 'baru') {
                    router.back();
                }
            } catch (_) {}
        };

        setFormAction();
    }, [params, router]);

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <h5>Ubah Data Transparansi Keuangan</h5>
                    <div className="p-fluid">
                        <div className="field">
                            <label htmlFor="bank">Bank</label>
                            <InputText id="bank" type="text" placeholder="Bank / kas" value={bank} onChange={(e) => setBank(e.target.value)} />
                        </div>
                        <div className="field">
                            <label htmlFor="account">Nama</label>
                            <InputText id="account" type="text" placeholder="Nama" value={account} onChange={(e) => setAccount(e.target.value)} />
                        </div>
                        <div className="field">
                            <label htmlFor="number">Rekening</label>
                            <InputText id="number" type="text" placeholder="No rekening/telepon" value={number} onChange={(e) => setNumber(e.target.value)} />
                        </div>
                        <div className="field">
                            <label htmlFor="amount">Nominal</label>
                            <InputNumber id="amount" placeholder="Nominal" value={amount} onValueChange={(e) => setAmount(e.value || 0)} min={0} maxFractionDigits={0} mode="currency" currency="IDR" />
                        </div>
                        <div className="field">
                            <label htmlFor="proof">Bukti</label>
                            <InputText id="proof" type="text" placeholder="Bukti nominal saldo" value={proof} onChange={(e) => setProof(e.target.value)} />
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
                                    const response = await fetch('/api/money', { method: 'POST', body: JSON.stringify({ action, bank, account, number, amount, proof }), headers: { 'Content-Type': 'application/json' } });
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

export default FormBank;
