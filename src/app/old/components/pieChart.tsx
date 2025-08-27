import { FC} from 'react';
import { Chart as ChartJS, Tooltip, ArcElement } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { divergingPalette } from '../common';

ChartJS.register(ArcElement, Tooltip);


interface PieChartProps{
    data : {
        x : string[] | object[] | number[],
        y : string[] | object[] | number[]
    },
}

const PieChart : FC<PieChartProps> = ({data}) =>{


    const chartData = {
        labels: Array.isArray(data.y) ? data.y.map(String) : [],
        datasets: [
            {
                label: 'Pie Dataset',
                data: data.x,
                backgroundColor: divergingPalette,
                borderWidth: 6,
                hoverOffset: 30
            },
        ],
    }

    const chartOptions = {
        responsive: true,
        plugins :{
            legend : {
                position : "bottom" as const,
                labels: {
                    boxWidth: 20,
                    padding: 15
                }
            },
        },
    }

    
    return (
        <Pie data={chartData} options={chartOptions}/>
    )
}

export default PieChart