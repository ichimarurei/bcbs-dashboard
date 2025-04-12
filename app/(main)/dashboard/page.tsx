/* eslint-disable @next/next/no-img-element */
'use client';

import { IBank } from '@/models/bank';
import { ChartDataState, ChartOptionsState } from '@/types';
import { ChartData, ChartOptions } from 'chart.js';
import dayjs from 'dayjs';
import { cloneDeep, forIn } from 'lodash';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { useEffect, useState } from 'react';

const chartDefault: { [key: string]: number } = { January: 0, February: 0, March: 0, April: 0, May: 0, June: 0, July: 0, August: 0, September: 0, October: 0, November: 0, December: 0 };

const Dashboard = () => {
    const [debit, setDebit] = useState(0);
    const [kredit, setKredit] = useState(0);
    const [donate, setDonate] = useState(0);
    const [actual, setActual] = useState(0);
    const [keeper, setKeeper] = useState(0);
    const [transparent, setTransparent] = useState(0);
    const [chartSave, setChartSave] = useState<{ [key: string]: number }>(cloneDeep(chartDefault));
    const [chartLoan, setChartLoan] = useState<{ [key: string]: number }>(cloneDeep(chartDefault));
    const [chartDebt, setChartDebt] = useState<{ [key: string]: number }>(cloneDeep(chartDefault));
    const [chartDonate, setChartDonate] = useState<{ [key: string]: number }>(cloneDeep(chartDefault));
    const [chartOptions, setChartOptions] = useState<ChartOptionsState>({});
    const [chartData, setChartData] = useState<ChartDataState>({});
    const router = useRouter();

    const fetchTransparent = async () => {
        try {
            const response = await fetch('/api/stats', { method: 'GET', headers: { 'Content-Type': 'application/json' } });
            const stats = await response.json();

            if (stats?.counts) {
                if (stats.counts?.debit > 0) {
                    setDebit(stats.counts.debit);
                }

                if (stats.counts?.kredit > 0) {
                    setKredit(stats.counts.kredit);
                }

                if (stats.counts?.donation > 0) {
                    setDonate(stats.counts.donation);
                }

                if (stats.counts?.actual > 0) {
                    setActual(stats.counts.actual);
                }

                if (stats.counts?.primary > 0) {
                    setKeeper(stats.counts.primary);
                }
            }

            if (stats?.chart) {
                const chartSave: { [key: string]: number } = cloneDeep(chartDefault);
                const chartLoan: { [key: string]: number } = cloneDeep(chartDefault);
                const chartDebt: { [key: string]: number } = cloneDeep(chartDefault);
                const chartDonate: { [key: string]: number } = cloneDeep(chartDefault);

                forIn(stats.chart.saveByDate, (value, key) => {
                    if (value > 0) {
                        chartSave[key] = value;
                    }
                });

                forIn(stats.chart.loanByDate, (value, key) => {
                    if (value > 0) {
                        chartLoan[key] = value;
                    }
                });

                forIn(stats.chart.debtByDate, (value, key) => {
                    if (value > 0) {
                        chartDebt[key] = value;
                    }
                });

                forIn(stats.chart.donateByDate, (value, key) => {
                    if (value > 0) {
                        chartDonate[key] = value;
                    }
                });

                setChartSave(chartSave);
                setChartLoan(chartLoan);
                setChartDebt(chartDebt);
                setChartDonate(chartDonate);
            }

            if (stats?.notes) {
                let recorded = 0;
                (stats.notes as IBank[]).forEach(({ amount }) => (recorded += amount));
                setTransparent(recorded);
            }
        } catch (_) {}
    };

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color') || '#495057';
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary') || '#6c757d';
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border') || '#dfe7ef';

        const pieData: ChartData = {
            labels: ['Simpanan', 'Kredit', 'Infaq'],
            datasets: [
                {
                    data: [debit, kredit, donate],
                    backgroundColor: [documentStyle.getPropertyValue('--green-500'), documentStyle.getPropertyValue('--orange-500'), documentStyle.getPropertyValue('--cyan-500')],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--green-400'), documentStyle.getPropertyValue('--orange-400'), documentStyle.getPropertyValue('--cyan-400')]
                }
            ]
        };
        const pieOptions: ChartOptions = {
            plugins: {
                legend: { labels: { usePointStyle: true, color: textColor } },
                tooltip: { callbacks: { label: (context) => formatCurrency(Number(context.raw)) } }
            },
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 1
        };

        const lineData: ChartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [
                {
                    label: 'Simpanan',
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--green-500'),
                    borderColor: documentStyle.getPropertyValue('--green-500'),
                    tension: 0.4,
                    data: [chartSave.January, chartSave.February, chartSave.March, chartSave.April, chartSave.May, chartSave.June, chartSave.July, chartSave.August, chartSave.September, chartSave.October, chartSave.November, chartSave.December]
                },
                {
                    label: 'Pinjaman',
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--yellow-500'),
                    borderColor: documentStyle.getPropertyValue('--yellow-500'),
                    tension: 0.4,
                    data: [chartLoan.January, chartLoan.February, chartLoan.March, chartLoan.April, chartLoan.May, chartLoan.June, chartLoan.July, chartLoan.August, chartLoan.September, chartLoan.October, chartLoan.November, chartLoan.December]
                },
                {
                    label: 'Cicilan',
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--orange-500'),
                    borderColor: documentStyle.getPropertyValue('--orange-500'),
                    tension: 0.4,
                    data: [chartDebt.January, chartDebt.February, chartDebt.March, chartDebt.April, chartDebt.May, chartDebt.June, chartDebt.July, chartDebt.August, chartDebt.September, chartDebt.October, chartDebt.November, chartDebt.December]
                },
                {
                    label: 'Infaq',
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--cyan-500'),
                    borderColor: documentStyle.getPropertyValue('--cyan-500'),
                    tension: 0.4,
                    data: [
                        chartDonate.January,
                        chartDonate.February,
                        chartDonate.March,
                        chartDonate.April,
                        chartDonate.May,
                        chartDonate.June,
                        chartDonate.July,
                        chartDonate.August,
                        chartDonate.September,
                        chartDonate.October,
                        chartDonate.November,
                        chartDonate.December
                    ]
                }
            ]
        };
        const lineOptions: ChartOptions = {
            plugins: { legend: { labels: { color: textColor } }, tooltip: { callbacks: { label: (context) => formatCurrency(Number(context.raw)) } } },
            scales: {
                x: {
                    ticks: { color: textColorSecondary },
                    grid: { color: surfaceBorder },
                    border: { display: false }
                },
                y: {
                    ticks: { color: textColorSecondary },
                    grid: { color: surfaceBorder },
                    border: { display: false }
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 1
        };

        setChartOptions({ pieOptions, lineOptions });
        setChartData({ pieData, lineData });
    }, [chartDebt, chartDonate, chartLoan, chartSave, debit, donate, kredit]);

    useEffect(() => {
        fetchTransparent();
    }, []);

    const formatCurrency = (value: number) => {
        return value
            ?.toLocaleString('id-ID', {
                style: 'currency',
                currency: 'IDR'
            })
            .replace(',00', '');
    };

    return (
        <div className="grid p-fluid">
            <div className="col-12">
                <div className="grid grid-nogutter surface-0 text-800">
                    <div className="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center ">
                        <section>
                            <span className="block text-6xl font-bold mb-1">Baitul Mal</span>
                            <div className="text-6xl text-primary font-bold mb-3">Cicurug Bata</div>
                            <p className="mt-0 mb-4 text-700 line-height-3">
                                Nominal transparansi keuangan terdata sebesar {transparent !== actual && '🔥'} <b className={`text-${transparent === actual ? 'green' : 'red'}-500`}>{formatCurrency(transparent)}</b>.
                            </p>
                            <Button label="Detail" type="button" className="p-button-outlined" onClick={() => router.replace('/')} />
                        </section>
                    </div>
                </div>
            </div>

            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Saldo Terkini</span>
                            <div className="text-900 font-medium text-xl">
                                {transparent !== actual && '🔥'} {formatCurrency(actual)}
                            </div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-calculator text-blue-500 text-xl" />
                        </div>
                    </div>
                    <span className={`text-${transparent === actual ? 'blue' : 'red'}-500 font-medium`}>Total saldo/kas</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Saldo Aman</span>
                            <div className="text-900 font-medium text-xl">{formatCurrency(keeper)}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-green-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-money-bill text-green-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">Batas aman saldo/kas</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Simpanan</span>
                            <div className="text-900 font-medium text-xl">{formatCurrency(debit)}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-wallet text-cyan-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-cyan-500 font-medium">Tabungan anggota</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Kredit</span>
                            <div className="text-900 font-medium text-xl">{formatCurrency(kredit)}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-credit-card text-orange-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-orange-500 font-medium">Kredit anggota</span>
                </div>
            </div>

            <div className="col-12 xl:col-6">
                <div className="card flex flex-column align-items-center">
                    <h5 className="text-left w-full">Transaksi</h5>
                    <Chart type="pie" data={chartData.pieData} options={chartOptions.pieOptions} />
                </div>
            </div>
            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Pergerakan di {dayjs().get('year')}</h5>
                    <Chart type="line" data={chartData.lineData} options={chartOptions.lineOptions} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
