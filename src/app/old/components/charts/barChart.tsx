import { generatePalette } from "@/app/old/utilities";
import {BarElement, Chart as ChartJS} from 'chart.js';
import { FC } from "react";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement)

interface BarChartProps{
    data : {
        x : string[] | object[] | number[],
        y : string[] | object[] | number[]
    },
    color : string
}

const BarChart : FC<BarChartProps> = ({data, color}) =>{
    const chartData = {
        labels: data.y?.length == 0 ? [data.y[0], data.y[0]] : data.y,
        datasets : [
            {
                label: 'Revenue ',
                data : data.x,
                backgroundColor: generatePalette(color, data.x.length || 10),
                borderWidth: 2,
                hoverOffset: 30,
                borderRadius: 10
            }
        ] 
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                ticks: {
                    callback: function (value) {
                        return  (value > 10000 ? value / 1000 + 'K' : value); // Format as ₹ K
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
                enabled : true,
                backgroundColor: 'rgba(0,0,0,0.8)', // Dark background
                titleColor: '#fff',
                bodyColor: '#fff',
                padding: 10,
                cornerRadius: 8,
                displayColors: false, 
                callbacks: {
                    label: function (context) {
                        return `${context.raw.toLocaleString()}`; // Tooltip format ₹ xx,xxx
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
        <Bar data={chartData} options={options} width={'100%'} />
    )
}

export default BarChart