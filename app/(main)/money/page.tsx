'use client';

import { formatRp } from '@/lib/function';
import { IBank } from '@/models/bank';
import { useRouter } from 'next/navigation';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import React, { useCallback, useEffect, useState } from 'react';

const TableBank = () => {
    const [list, setList] = useState<IBank[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<DataTableFilterMeta>({});
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const router = useRouter();
    const rpBodyTemplate = (rowData: IBank) => formatRp(rowData.amount);
    const editBodyTemplate = (rowData: IBank) => <Button icon="pi pi-pencil" outlined onClick={() => router.push(`/money/${rowData.id}`)} />;

    const initFilters = () => {
        setGlobalFilterValue('');
        setFilters({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });
    };

    const fetching = useCallback(async () => {
        try {
            const response = await fetch('/api/money', { method: 'GET', headers: { 'Content-Type': 'application/json' } });
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

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Data Transparansi Keuangan</h5>
                    <DataTable
                        className="p-datatable-gridlines"
                        header={renderHeader}
                        loading={loading}
                        filters={filters}
                        value={list}
                        rows={10}
                        dataKey="id"
                        filterDisplay="menu"
                        emptyMessage="Tidak ditemukan data transparansi!"
                        paginator
                        showGridlines
                        stripedRows
                        scrollable
                    >
                        <Column field="bank" header="Bank / Kas" />
                        <Column field="number" header="No Rekening/Telepon" />
                        <Column field="account" header="Nama" />
                        <Column field="amount" header="Nominal" body={rpBodyTemplate} />
                        <Column header="" body={editBodyTemplate} className="filter-action-button" />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default TableBank;
