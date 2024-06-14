"use client";

import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const TransactionStats: React.FC = () => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const chartData = {
            labels: [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
            ],
            datasets: [{
                label: 'Sales Revenue',
                data: [12, 19, 3, 4, 5, 12, 19, 3, 4, 5, 3, 7],
                borderWidth: 1,
            }],
        };

        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                        autoSkip: false,
                    },
                },
                y: {
                    beginAtZero: true,
                },
            },
        };

        const ctx = chartRef.current?.getContext('2d');

        if (ctx) {
            const newChart = new Chart(ctx, {
                type: 'bar',
                data: chartData,
                options: chartOptions,
            });

            return () => {
                newChart.destroy();
            };
        }
    }, []);

    return (
        <div className="border rounded px-3 py-2 w-full shadow-md">
            <canvas ref={chartRef} id="salesRevenue" width={400} height={400}></canvas>
        </div>
    );
}

export default TransactionStats;
