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



const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
}).format;


export default function Home() {
  const theme = useTheme();
  const [topSelling, setTopSelling] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [interval, setInterval] = useState<'year' | 'month' | 'day'>('year');

  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if(topSelling && topSelling.length == 0){
      fetchTopSelling()
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

  useEffect(() =>{
    fetchEarnings()
  })



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
      }

    } catch(error) {
      console.error('Error fetching order Earnings:', error);
    }
  }

  const chartData = earnings.map((item) => ({
    x:  moment(item.month).format("MMM YY"),
    y: item.total_amount,
  }));

  const selectOnChange = (event) =>{
    console.log(event)
    setInterval(event.target.value); 
    fetchEarnings(event.target.value)
  }


  return (
    <div className='md:p-4 p-6 md:w-screen overflow-x-hidden'>

      <Card className='md:w-fit w-full mx-auto'>
      <h5 className="text-2xl text-center my-4 font-bold leading-none text-gray-900 dark:text-white">Top Selling Items</h5>
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
                arcLabel: (item) => `${item.value}`,
                arcLabelMinAngle: 35,
                cx:150,
                cy: isMobile ? 120 : 100
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
          width={isMobile ? (windowSize.width - 80) : 600}
          height={isMobile ? 380 : 200}
          
        ></PieChart>
      </Card>


      <Card className='md:w-fit w-full mx-auto'>
        <h5 className="text-2xl text-center my-4 font-bold leading-none text-gray-900 dark:text-white">Earnings</h5>
       
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
            series={[{ data: chartData.map((d) => d.y), label:"Total Amount (₹)" }]}
            borderRadius = {6}
            width={800}
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
