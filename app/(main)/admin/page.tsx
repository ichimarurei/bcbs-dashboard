'use client';

import { IAdmin } from '@/models/admin';
import { useRouter } from 'next/navigation';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import React, { useCallback, useEffect, useState } from 'react';

const TableAdmin = () => {
    const [list, setList] = useState<IAdmin[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<DataTableFilterMeta>({});
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const router = useRouter();
    const statusBodyTemplate = (rowData: IAdmin) => <Tag value={rowData.status ? 'AKTIF' : 'TIDAK AKTIF'} severity={rowData.status ? 'success' : 'warning'} />;
    const editBodyTemplate = (rowData: IAdmin) => <Button icon="pi pi-pencil" outlined onClick={() => router.push(`/admin/${rowData._id}`)} />;

    const initFilters = () => {
        setGlobalFilterValue('');
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
            },
            phone: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
            },
            status: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            }
        });
    };

    const fetching = useCallback(async () => {
        try {
            const response = await fetch('/api/admin', { method: 'GET', headers: { 'Content-Type': 'application/json' } });
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
                <Button type="button" icon="pi pi-user" label="Tambah" outlined onClick={() => router.push('/admin/baru')} />
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
                    <h5>Data Admin / Pengurus</h5>
                    <DataTable
                        className="p-datatable-gridlines"
                        header={renderHeader}
                        loading={loading}
                        filters={filters}
                        value={list}
                        rows={10}
                        dataKey="id"
                        filterDisplay="menu"
                        emptyMessage="Tidak ditemukan data admin!"
                        paginator
                        showGridlines
                        stripedRows
                        scrollable
                    >
                        <Column field="phone" header="Telepon" />
                        <Column field="name" header="Nama" />
                        <Column field="status" header="Status" body={statusBodyTemplate} />
                        <Column header="" body={editBodyTemplate} className="filter-action-button" />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default TableAdmin;
