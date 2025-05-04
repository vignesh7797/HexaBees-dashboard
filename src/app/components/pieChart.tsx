import { FC} from 'react';
import { Chart as ChartJS, Tooltip, ArcElement, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);


interface PieChartProps{
    // data : {
    //     x : string[] | object[] | number[],
    //     y : string[] | object[] | number[]
    // },
    color : string
}

const PieChart : FC<PieChartProps> = () =>{
    // const chartRef = useRef(null);
    // const [gradient, setGradient] = useState(null);

    const chartData = {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
            {
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 2,
            },
        ],
    }

    // const options = {}

    return (
        <Pie data={chartData}/>
    )
}

export default PieChart