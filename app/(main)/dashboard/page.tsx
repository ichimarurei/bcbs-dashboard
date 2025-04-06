/* eslint-disable @next/next/no-img-element */
'use client';

import { ChartDataState, ChartOptionsState } from '@/types';
import { ChartData, ChartOptions } from 'chart.js';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { useEffect, useState } from 'react';

const Dashboard = () => {
    const [chartOptions, setChartOptions] = useState<ChartOptionsState>({});
    const [chartData, setChartData] = useState<ChartDataState>({});
    const router = useRouter();

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color') || '#495057';
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary') || '#6c757d';
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border') || '#dfe7ef';

        const pieData: ChartData = {
            labels: ['Simpanan', 'Cicilan', 'Infaq'],
            datasets: [
                {
                    data: [540, 325, 702],
                    backgroundColor: [documentStyle.getPropertyValue('--green-500'), documentStyle.getPropertyValue('--orange-500'), documentStyle.getPropertyValue('--cyan-500')],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--green-400'), documentStyle.getPropertyValue('--orange-400'), documentStyle.getPropertyValue('--cyan-400')]
                }
            ]
        };
        const pieOptions: ChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    }
                }
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
                    data: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56]
                },
                {
                    label: 'Pinjaman',
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--yellow-500'),
                    borderColor: documentStyle.getPropertyValue('--yellow-500'),
                    tension: 0.4,
                    data: [28, 48, 40, 19, 86, 27, 90, 28, 48, 40, 19, 86]
                },
                {
                    label: 'Cicilan',
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--orange-500'),
                    borderColor: documentStyle.getPropertyValue('--orange-500'),
                    tension: 0.4,
                    data: [30, 44, 40, 21, 77, 25, 92, 30, 44, 40, 21, 77]
                },
                {
                    label: 'Infaq',
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--cyan-500'),
                    borderColor: documentStyle.getPropertyValue('--cyan-500'),
                    tension: 0.4,
                    data: [33, 40, 34, 19, 68, 32, 93, 33, 40, 34, 19, 68]
                }
            ]
        };
        const lineOptions: ChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    },
                    border: {
                        display: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    },
                    border: {
                        display: false
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 1
        };

        setChartOptions({ pieOptions, lineOptions });
        setChartData({ pieData, lineData });
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
                                Status transparansi keuangan saat ini terlihat <b className="text-green-700">AMAN</b>.
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
                            <div className="text-900 font-medium text-xl">{formatCurrency(19388500)}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-calculator text-blue-500 text-xl" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Saldo Aman</span>
                            <div className="text-900 font-medium text-xl">{formatCurrency(21775000)}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-green-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-money-bill text-green-500 text-xl" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Simpanan</span>
                            <div className="text-900 font-medium text-xl">{formatCurrency(74924500)}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-wallet text-cyan-500 text-xl" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Cicilan</span>
                            <div className="text-900 font-medium text-xl">{formatCurrency(58540000)}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-credit-card text-orange-500 text-xl" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12 xl:col-6">
                <div className="card flex flex-column align-items-center">
                    <h5 className="text-left w-full">Perbandingan</h5>
                    <Chart type="pie" data={chartData.pieData} options={chartOptions.pieOptions} />
                </div>
            </div>
            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Perkembangan</h5>
                    <Chart type="line" data={chartData.lineData} options={chartOptions.lineOptions} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
