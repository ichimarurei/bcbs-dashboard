'use client';

import { formatRp } from '@/lib/function';
import { IAccount } from '@/models/account';
import { ICash } from '@/models/cash';
import { ChartData, ChartOptions } from 'chart.js';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { last, sortBy } from 'lodash';
import { useRouter } from 'next/navigation';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { InputNumber } from 'primereact/inputnumber';
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

dayjs.locale('id');
dayjs.extend(customParseFormat);

const TableTransactionRecord = ({ params }: { params: Promise<{ slug: string; id: string }> }) => {
    const [list, setList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<DataTableFilterMeta>({});
    const [chartOptions, setChartOptions] = useState<ChartOptions | null>(null);
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [customer, setCustomer] = useState<IAccount | null>(null);
    const [signedAdmin, setSignedAdmin] = useState<any>(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [category, setCategory] = useState('');
    const [finalCount, setFinalCount] = useState<number>(0);
    const [isShowForm, setShowForm] = useState(false);
    const [isSubmitLoad, setSubmitLoad] = useState(false);
    const [isRemoval, setRemoval] = useState(false);
    const [payloadAction, setPayloadAction] = useState('baru');
    const [payloadType, setPayloadType] = useState('');
    const [payloadAmount, setPayloadAmount] = useState<number | undefined>();
    const [payloadDate, setPayloadDate] = useState<any>(dayjs().toDate());

    const router = useRouter();
    const toast = useRef<Toast>(null);
    const allowedCategories = useMemo(() => ['saving', 'loan'], []);
    const infoCategories = useMemo<{ [key: string]: string }>(() => ({ saving: 'Simpanan', loan: 'Pinjaman' }), []);
    const mapTypes = useMemo(
        () => [
            { value: 'tabungan', label: 'Tabungan' },
            { value: 'wajib', label: 'Simpanan Wajib' },
            { value: 'tarik', label: 'Penarikan Simpanan' },
            { value: 'pokok', label: 'Simpanan Pokok' },
            { value: 'cicilan', label: 'Bayar Cicilan' },
            { value: 'pinjaman', label: 'Ambil Pinjaman' }
        ],
        []
    );

    const dateBodyTemplate = (rowData: ICash) => dayjs(rowData.date, 'DD-MM-YYYY').format('DD MMMM YYYY');
    const typeBodyTemplate = (rowData: ICash) => mapTypes.find(({ value }) => value === rowData.type)?.label || rowData.type;
    const amountBodyTemplate = (rowData: ICash) => formatRp(rowData.amount);
    const countBodyTemplate = (rowData: ICash & { count: number }) => formatRp(rowData.count);
    const editBodyTemplate = (rowData: ICash) => <Button icon="pi pi-pencil" outlined onClick={() => toggleForm(rowData?.type, rowData?.id)} />;

    const toggleForm = (type: string = '', id: string = 'baru') => {
        setShowForm(!isShowForm);
        setPayloadAction(id);
        setPayloadType(type);
        setPayloadAmount(undefined);
        setPayloadDate(dayjs().toDate());
        setRemoval(false);

        if (id !== 'baru') {
            const exist = list.find((item) => item.id === id);

            if (exist) {
                setPayloadAmount(exist.amount);
                setPayloadDate(dayjs(exist.date, 'DD-MM-YYYY').toDate());
            }
        }
    };

    const fetchTransactions = useCallback(
        async (category: string, account: string, documentStyle: CSSStyleDeclaration) => {
            try {
                const response = await fetch(`/api/cash/${category}/${account}`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
                const cashes: ICash[] = await response.json();
                const labels: string[] = [];
                const saldo: number[] = [];
                const daily: { [key: string]: number } = {};
                let countSaving = 0;
                let countLoan = 0;

                sortBy(cashes, ['created']).forEach((flow) => {
                    if (flow.category === 'saving') {
                        if (flow.type === 'tarik') {
                            countSaving -= flow?.amount || 0;
                        } else {
                            countSaving += flow?.amount || 0;
                        }
                    } else {
                        if (flow.type === 'cicilan') {
                            countLoan -= flow?.amount || 0;
                        } else {
                            countLoan += flow?.amount || 0;
                        }
                    }

                    daily[dayjs(flow.created).format('DD-MM-YYYY HH:mm')] = flow.category === 'saving' ? countSaving : countLoan;
                });

                Object.keys(daily).forEach((key) => {
                    labels.push(key);
                    saldo.push(daily[key]);
                });

                const lineData: ChartData = {
                    labels,
                    datasets: [
                        {
                            label: infoCategories[category],
                            data: saldo,
                            fill: false,
                            tension: 0.4,
                            backgroundColor: documentStyle?.getPropertyValue(`--${category === 'saving' ? 'green' : 'orange'}-500`) || '#6366f1',
                            borderColor: documentStyle?.getPropertyValue(`--${category === 'saving' ? 'green' : 'orange'}-500`) || '#6366f1'
                        }
                    ]
                };

                const lineOptions: ChartOptions = {
                    plugins: { legend: { display: false } },
                    responsive: true,
                    maintainAspectRatio: false,
                    aspectRatio: 1,
                    scales: { x: { display: false }, y: { display: false } }
                };

                setChartData(lineData);
                setChartOptions(lineOptions);
                setFinalCount(last(saldo) || 0);
                setList(cashes.map((flow, at) => ({ ...flow, count: daily[dayjs(flow.created).format('DD-MM-YYYY HH:mm')] })));
            } catch (_) {}
        },
        [infoCategories]
    );

    const initFilters = () => {
        setGlobalFilterValue('');
        setFilters({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });
    };

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
        const fetching = async () => {
            const { slug, id } = await params;
            const response = await fetch(`/api/account/${id}`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
            const account: IAccount = await response.json();

            if (account?._id) {
                await fetchTransactions(slug, account.id, getComputedStyle(document.documentElement));
                setCategory(allowedCategories.includes(slug) ? slug : allowedCategories[0]);
                setSignedAdmin(JSON.parse(sessionStorage.getItem('bcbs-session') || '{}'));
                setCustomer(account);
                setLoading(false);
                initFilters();
            } else {
                router.back();
            }
        };

        fetching();
    }, [allowedCategories, fetchTransactions, params, router]);

    return (
        <div className="grid">
            <div className="col-12 lg:col-6">
                <div className="p-3 h-full">
                    <div className="shadow-2 p-3 h-full flex flex-column" style={{ borderRadius: '6px' }}>
                        <div className="flex align-items-center">
                            <span className="font-bold text-2xl text-900">{customer?.name}</span>
                        </div>
                        <hr className="my-3 mx-0 border-top-1 border-bottom-none border-300" />
                        <div className="text-600">{category === 'saving' ? 'Saldo Simpanan' : 'Sisa Cicilan'}</div>
                        <div className={`text-${category === 'saving' ? 'green' : 'orange'}-500 font-bold text-xl mb-2 uppercase`}>{formatRp(finalCount)}</div>
                        <hr className="my-3 mx-0 border-top-1 border-bottom-none border-300" />
                        <ul className="list-none p-0 m-0 flex-grow-1">
                            <li className="flex align-items-center mb-3">
                                <i className="text-green-500 mr-2">No. Anggota</i>
                                <span>{customer?.number || '[ # ]'}</span>
                            </li>
                            <li className="flex align-items-center mb-3">
                                <i className="text-green-500 mr-2">Area (RT)</i>
                                <span>{customer?.area ? `RT ${customer.area.toLowerCase().replace('rt', '')}` : '[ - ]'}</span>
                            </li>
                            <li className="flex align-items-center mb-3">
                                <i className="text-green-500 mr-2">Admin</i>
                                <span>{signedAdmin?.name}</span>
                            </li>
                            <li className="flex align-items-center mb-3">
                                <i className="text-green-500 mr-2">Hari ini</i>
                                <span>{dayjs().format('DD MMMM YYYY')}</span>
                            </li>
                        </ul>
                        {!isShowForm && (
                            <>
                                <hr className="mb-3 mx-0 border-top-1 border-bottom-none border-300 mt-auto" />
                                <div className="flex flex-wrap gap-2">
                                    {category === 'saving' ? (
                                        <>
                                            <Button label="Simpanan Pokok" className="p-3 mt-auto" onClick={() => toggleForm('pokok')} />
                                            <Button label="Simpanan Wajib" className="p-3 mt-auto" severity="info" onClick={() => toggleForm('wajib')} />
                                            <Button label="Tabungan" className="p-3 mt-auto" severity="success" onClick={() => toggleForm('tabungan')} />
                                            <Button label="Penarikan Simpanan" className="p-3 mt-auto" severity="warning" onClick={() => toggleForm('tarik')} />
                                        </>
                                    ) : (
                                        <>
                                            <Button label="Bayar Cicilan" className="p-3 mt-auto" severity="help" onClick={() => toggleForm('cicilan')} />
                                            <Button label="Ambil Pinjaman" className="p-3 mt-auto" severity="danger" onClick={() => toggleForm('pinjaman')} />
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            {!isShowForm && chartData && chartOptions && (
                <div className="col-12 lg:col-6">
                    <div className="card">
                        <h5>Perkembangan</h5>
                        <Chart type="line" data={chartData} options={chartOptions}></Chart>
                    </div>
                </div>
            )}

            {!isShowForm && (
                <div className="col-12">
                    <div className="card">
                        <h5>Data Transaksi {infoCategories[category]}</h5>
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
                            <Column field="date" header="Tanggal" body={dateBodyTemplate} />
                            <Column field="type" header="Jenis" body={typeBodyTemplate} />
                            <Column field="amount" header="Nominal" body={amountBodyTemplate} />
                            <Column field="count" header={category === 'saving' ? 'Saldo' : 'Sisa'} body={countBodyTemplate} />
                            <Column header="" body={editBodyTemplate} className="filter-action-button" />
                        </DataTable>
                    </div>
                </div>
            )}

            {isShowForm && (
                <div className="col-12">
                    <div className="card">
                        <Toast ref={toast} />
                        <h5>
                            {payloadAction === 'baru' ? 'Tambah' : 'Ubah'} Data {mapTypes.find(({ value }) => value === payloadType)?.label}
                        </h5>
                        <div className="p-fluid">
                            <div className="field">
                                <label htmlFor="number">Tanggal</label>
                                <Calendar showIcon showButtonBar dateFormat="dd MM yy" value={payloadDate} onChange={(e) => setPayloadDate(e.value ?? null)} />
                            </div>
                            <div className="field">
                                <label htmlFor="amount">Nominal</label>
                                <InputNumber id="amount" placeholder="Nominal" value={payloadAmount} onValueChange={(e) => setPayloadAmount(e.value || 0)} min={0} maxFractionDigits={0} mode="currency" currency="IDR" />
                            </div>
                            {payloadAction !== 'baru' && (
                                <div className="field">
                                    <label htmlFor="removal">Hapus data ini?</label> <br />
                                    <InputSwitch id="removal" checked={isRemoval} onChange={(e) => setRemoval(e.value)} />
                                </div>
                            )}
                        </div>
                        <hr />
                        <div className="flex justify-content-between flex-wrap">
                            <Button label="Batal" icon="pi pi-times" severity="info" onClick={() => toggleForm()} />
                            {!isSubmitLoad && (
                                <Button
                                    label="Simpan"
                                    icon="pi pi-check"
                                    className="form-action-button"
                                    onClick={async () => {
                                        setSubmitLoad(true);
                                        const response = await fetch(`/api/cash/${category}/${customer?.id}`, {
                                            method: 'POST',
                                            body: JSON.stringify({ action: payloadAction, type: payloadType, amount: payloadAmount, date: dayjs(payloadDate).format('DD-MM-YYYY'), operator: signedAdmin?.phone, removal: isRemoval ?? false }),
                                            headers: { 'Content-Type': 'application/json' }
                                        });
                                        const result = await response.json();
                                        setSubmitLoad(false);

                                        if (result?.saved) {
                                            toggleForm();
                                            router.refresh();
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
            )}
        </div>
    );
};

export default TableTransactionRecord;
