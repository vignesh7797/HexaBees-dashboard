import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Filler, Tooltip } from 'chart.js';
import { FC, useEffect, useRef, useState } from 'react';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Filler, Tooltip);

interface LineChartProps {
    data: {
        x: string[] | object[] | number[],
        y: string[] | object[] | number[]
    },
    color: string
}


const LineChart: FC<LineChartProps> = ({ data, color }) => {

    const chartRef = useRef(null);
    const [gradient, setGradient] = useState(null);



    // 🎨 Create gradient once chart is mounted and canvas is available
    useEffect(() => {
        const chart = chartRef.current;
        if (chart) {
            const ctx = chart.canvas.getContext('2d');
            const gradientFill = ctx.createLinearGradient(0, 0, 0, 300);
            gradientFill.addColorStop(0, color + '66'); // Red at top
            gradientFill.addColorStop(1, color + '00');   // Transparent at bottom
            setGradient(gradientFill);
        }
    }, []);


    const chartData = {

        labels: data.y?.length == 0 ? [data.y[0], data.y[0]] : data.y,
        datasets: [
            {
                label: 'Revenue',
                data: data.x,
                borderColor: color, // Red border
                backgroundColor: gradient,
                tension: 0.1, // Smooth curve
                fill: true, // Fill under line
                pointRadius: 2.5, // Points size
                borderWidth: 3, // Thick line
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                ticks: {
                    callback: function (value) {
                        return '₹ ' + (value > 10000 ? value / 1000 + 'K' : value); // Format as ₹ K
                    },
                    color: '#4b5563', // Gray-600
                    font: { size: 12 },
                },
                grid: {
                    display: false,
                },
            },
            x: {
                ticks: {
                    color: '#4b5563', // Gray-600
                    font: { size: 12 },
                },
                grid: {
                    display: false, // No vertical grid lines
                },
            },
        },
        plugins: {
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(0,0,0,0.8)', // Dark background
                titleColor: '#fff',
                bodyColor: '#fff',
                padding: 10,
                cornerRadius: 8,
                displayColors: false,
                callbacks: {
                    label: function (context) {
                        return `₹ ${context.raw.toLocaleString()}`; // Tooltip format ₹ xx,xxx
                    },
                },
            },
            interaction: {
                mode: 'index', // Shows tooltip when hovering near X-axis
                intersect: false, // Doesn't require direct intersection with point
            },
        },
    };

    return (

        <Line ref={chartRef} data={chartData} options={options} height={'250px'} />

    )
}

export default LineChart;