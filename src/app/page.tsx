'use client';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart'
import { Card, Select } from 'flowbite-react';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import moment from 'moment';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';



const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
}).format;


export default function Home() {
  const theme = useTheme();
  const [topSelling, setTopSelling] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [interval, setInterval] = useState<'year' | 'month' | 'day'>('year');
  const [total, setTotal] = useState(0);

  const [data, setData] = useState([])

  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if(topSelling && topSelling.length == 0){
      fetchTopSelling();
      fetchEarnings()
    }

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  },[]);


  const fetchTopSelling = async() =>{
    try {
      const { data } = await axios.get('/api/top-selling');
      
      const newTS = data.map((dt, ind) => ({
        label : dt.name,
        value : dt.total_quantity,
        id : ind,
        price : dt.total_price
      }))

      setTopSelling(newTS);
  
    } catch (error) {
        console.error('Error fetching order Top Selling:', error);
    } 
  }

  const fetchEarnings = async (param = interval) => {
    try {
      const { data } = await axios.get(`/api/earnings?interval=${param}`);

      console.log(data)
      if(data.data && data.data.length > 0){
        setEarnings(data.data);

        let totl = 0;
        data.data.forEach(d => totl += Number(d.total_amount));
        setTotal(totl)
      }

    } catch(error) {
      console.error('Error fetching order Earnings:', error);
    }
  }

  const chartData = earnings.map((item) => ({
    x: interval == 'year' ? moment(item.month).format("MMM YY") : interval == 'month' ? moment(item.day).format('DD MMM') : moment(item.hour).format('HH:mm a'),
    y: item.total_amount,
  }));

  const selectOnChange = (event) =>{
    console.log(event)
    setInterval(event.target.value); 
    fetchEarnings(event.target.value)
  }

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "your_collection_name"));
      const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(docs);
    };

    fetchData();
  }, []);


  return (
    <div className='md:p-4 p-6 md:w-screen overflow-x-hidden'>

    <div className='card shadow rounded bg-white'>
      <h1>Firebase Firestore Data</h1>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{JSON.stringify(item)}</li>
        ))}
      </ul>
    </div>

      <Card className='md:w-fit w-full mx-auto'>
      <h5 className="text-2xl text-center my-4 font-bold leading-none text-orange-600 dark:text-white">Top Selling Items</h5>
        <PieChart
          series={[
              {
                data: topSelling,
                paddingAngle : 2,
                cornerRadius : 6,
                innerRadius : 10,
                highlightScope: { fade: 'global', highlight: 'item' },
                faded: { innerRadius: 0, additionalRadius: 8, color: 'gray' },
                valueFormatter: (value) =>
                  `${value.value} orders  |   ${currencyFormatter(value['price'])}`,
                arcLabel: (item) => `${currencyFormatter(item['price'])}`,
                arcLabelMinAngle: 35,
                cx: isMobile ? 150 : 200,
                cy: isMobile ? 120 : 150
              }
          ]}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fontWeight: 'bold',
            },
          }}
          slotProps={{
            legend: {
              direction: isMobile ? 'row' :'column',
              position: { vertical: 'bottom', horizontal: isMobile ? 'middle' : 'right' },
              itemMarkWidth: 10,
              itemMarkHeight: 7,
              markGap: 5,
              itemGap: 10,
            },
          }}
          width={windowSize.width ? windowSize.width - 80 : 300}
          height={isMobile ? 380 : 300}
          
        ></PieChart>
      </Card>


      <Card className='md:w-fit w-full mx-auto my-10'>
        <h5 className="text-4xl text-center my-4 font-bold leading-none text-orange-600 dark:text-white">Earnings</h5>
       
        <Select id="countries" value={interval} required className='w-fit' onChange={selectOnChange}>
          <option value={'year'}>Year</option>
          <option value={'month'}>Month</option>
          <option value={'day'}>Day</option>
        </Select>

        {earnings && (

          <BarChart
            xAxis={[{ 
              scaleType: 'band', 
              data: chartData.map((d) => d.x),
              
            }]}
            yAxis={[{
              colorMap: {
                type: 'continuous',
                min: 100000,
                max: 200000,
                color: ['#02B2AF', '#1a56db'],
              }
            }]}
            series={[{ data: chartData.map((d) => d.y), label:"Total Amount (₹"+ total +")" }]}
            borderRadius = {6}
            width={windowSize.width ? windowSize.width - 80 : 300}
            height={300}
            grid={{ horizontal: true }}
            
          />

        )}

      </Card>

      

      <Link href={'/menuList'} type="button" className="primary-btn">
            Go to Menu
      </Link>
    </div>
  );
}
