'use client';

import { IAccount } from '@/models/account';
import { useRouter } from 'next/navigation';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

const TableCustomerTransaction = ({ params }: { params: Promise<{ slug: string }> }) => {
    const [list, setList] = useState<IAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<DataTableFilterMeta>({});
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [category, setCategory] = useState('');

    const router = useRouter();
    const statusBodyTemplate = (rowData: IAccount) => <Tag value={rowData.status ? 'AKTIF' : 'TIDAK AKTIF'} severity={rowData.status ? 'success' : 'warning'} />;
    const editBodyTemplate = (rowData: IAccount) => <Button icon="pi pi-credit-card" outlined onClick={() => router.push(`/flow/${category}/${rowData.id}`)} />;

    const allowedCategories = useMemo(() => ['saving', 'loan'], []);
    const infoCategories = useMemo<{ [key: string]: string }>(() => ({ saving: 'Simpanan', loan: 'Pinjaman' }), []);

    const initFilters = () => {
        setGlobalFilterValue('');
        setFilters({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });
    };

    const fetching = useCallback(async () => {
        try {
            const response = await fetch('/api/account', { method: 'GET', headers: { 'Content-Type': 'application/json' } });
            setList(await response.json());
        } catch (_) {}

        setLoading(false);
        initFilters();
    }, []);

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filtered = { ...filters };
        (_filtered['global'] as any).value = value;

        setFilters(_filtered);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between flex-wrap">
                <span className="p-input-icon-left filter-input–table">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Pencarian" />
                </span>
            </div>
        );
    };

    useEffect(() => {
        setLoading(true);
        fetching();
    }, [fetching]);

    useEffect(() => {
        const categorize = async () => {
            const { slug } = await params;
            setCategory(allowedCategories.includes(slug) ? slug : allowedCategories[0]);
        };

        categorize();
    }, [allowedCategories, params]);

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Data {infoCategories[category]} Nasabah / Anggota</h5>
                    <DataTable
                        className="p-datatable-gridlines"
                        header={renderHeader}
                        loading={loading}
                        filters={filters}
                        value={list}
                        rows={10}
                        dataKey="id"
                        filterDisplay="menu"
                        emptyMessage="Tidak ditemukan data anggota!"
                        paginator
                        showGridlines
                        stripedRows
                        scrollable
                    >
                        <Column field="number" header="No Anggota" />
                        <Column field="name" header="Nama" />
                        <Column field="area" header="Area (RT)" />
                        <Column field="status" header="Status" body={statusBodyTemplate} />
                        <Column header="" body={editBodyTemplate} className="filter-action-button" />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default TableCustomerTransaction;
