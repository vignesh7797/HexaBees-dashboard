'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Table } from 'flowbite-react';
// import { useMediaQuery } from '@mui/material';
import moment from 'moment';
import LineChart from './components/lineChart';
import Image from 'next/image';

//icons
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { BiRupee } from "react-icons/bi";
import { toDecimal } from './utils/textFormatter';
import { BsBookmarks } from "react-icons/bs";
import { TbReceiptRupee } from "react-icons/tb";
import { VscCoffee } from "react-icons/vsc";
import { Banner } from './common';
import { FaRegImage } from "react-icons/fa6";


export default function Home() {
  const [topSelling, setTopSelling] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [interval, setInterval] = useState<'year' | 'month' | 'day'>('day');
  const [total, setTotal] = useState(0);
  const [revenueData, setRevenueData] = useState({})
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [averageRevenue, setAverageRevenue] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [todayOrders, setTodayOrders] = useState(0);

  // const [windowSize, setWindowSize] = useState({
  //   width: 0,
  //   height: 0,
  // });

  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (topSelling && topSelling.length == 0) {
      fetchTopSelling();
      fetchEarnings();
      fetchBannerData()
    }

    // const handleResize = () => {
    //   setWindowSize({
    //     width: window.innerWidth,
    //     height: window.innerHeight,
    //   });
    // };

    // handleResize();
    // window.addEventListener("resize", handleResize);

    // return () => window.removeEventListener("resize", handleResize);
  }, []);


  const fetchTopSelling = async () => {
    try {
      const { data } = await axios.get('/api/top-selling');

      setTopSelling(data);

    } catch (error) {
      console.error('Error fetching order Top Selling:', error);
    }
  }

  const fetchEarnings = async (param = interval) => {
    try {
      const { data } = await axios.get(`/api/earnings?interval=${param}`);

      console.log(data)
      if (data.data && data.data.length > 0) {
        setEarnings(data.data);

        let totl = 0;
        data.data.forEach(d => totl += Number(d.total_amount));
        setTotal(totl)
      }

    } catch (error) {
      console.error('Error fetching order Earnings:', error);
    }
  }

  const fetchBannerData = async () => {
    try {
      const { data } = await axios.get<Banner>('api/banner');
      console.log(data);
      setTotalOrders(data.totalOrders)
      setTotalRevenue(data.totalRevenue)
      setTodayOrders(data.todaysOrders)
      setTodayRevenue(data.todaysRevenue);
      setAverageRevenue(data.averageRevenue)
    } catch (error) {
      console.log(error);
    }
  }


  const selectOnChange = (event) => {
    console.log(event)
    setInterval(event.target.value);
    fetchEarnings(event.target.value)
  }

  useEffect(() => {
    setRevenueData({
      x: earnings.map(item => parseFloat(item.total_amount)),
      y: earnings.map(item => interval == 'year' ? moment(item.month).format("MMM YY") : interval == 'month' ? moment(item.day).format('DD MMM') : moment(item.hour).format('HH:mm a'))
    });
  }, [earnings])


  return (
    <div className='md:p-4 p-2 md:w-full overflow-x-hidden flex flex-wrap'>

      <div className="w-full md:w-1/2 h-[300px] p-4 rounded-lg shadow-lg bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-red-600 font-adlm">
            Total Revenue
            <span className='text-red-500 text-sm ms-2'>{`(₹ ${total})`}</span>
          </h2>
          <select onChange={selectOnChange} value={interval} className="border border-grey border-opacity-15 px-2 py-1 text-gray-600 focus:ring-0 focus:border-grey focus:border-opacity-15 w-[35%] md:w-[25%]">
            <option value={'year'}>Yearly</option>
            <option value={'month'}>Monthly</option>
            <option value={'day'}>Day</option>
          </select>
        </div>
            
        <div className='h-[220px]'>
          <LineChart data={revenueData} />
        </div>

      </div>

      <div className="w-full md:w-1/2 h-[300px] grid grid-cols-2 gap-4 mt-4 md:mt-0 md:ps-4">
        <div className="w-full  h-[140px] p-4 rounded-lg shadow-lg bg-white">
          <div className='bg-green-400 bg-opacity-20 rounded p-2 aspect-square w-fit text-green-500 text-lg'>
            <RiMoneyRupeeCircleLine />
          </div>
          <p className='flex items-center text-2xl font-adlm my-2 text-zinc-700'><BiRupee /> {toDecimal(totalRevenue)}</p>
          <p className='text-grey text-md font-adlm font-light opacity-60 px-2'>Total Revenue</p>
        </div>

        <div className="w-full  h-[140px] p-4 rounded-lg shadow-lg bg-white">
          <div className='bg-amber-400 bg-opacity-20 rounded p-2 aspect-square w-fit text-amber-600 text-lg'>
            <BsBookmarks />
          </div>
          <p className='flex items-center text-3xl font-adlm my-2 text-zinc-700'><BiRupee /> {averageRevenue}</p>
          <p className='text-grey text-md font-adlm font-light opacity-60 px-2'>Average Revenue Per Day</p>
        </div>

        <div className="w-full  h-[140px] p-4 rounded-lg shadow-lg bg-white">
          <div className='bg-amber-400 bg-opacity-20 rounded p-2 aspect-square w-fit text-amber-600 text-lg'>
            <BsBookmarks />
          </div>
          <p className='flex items-center text-3xl font-adlm my-2 text-zinc-700'><BiRupee /> {totalOrders}</p>
          <p className='text-grey text-md font-adlm font-light opacity-60 px-2'>Total Orders</p>
        </div>

        <div className="w-full  h-[140px] p-4 rounded-lg shadow-lg bg-white">
          <div className='bg-blue-400 bg-opacity-20 rounded p-2 aspect-square w-fit text-blue-500 text-lg'>
            <TbReceiptRupee />
          </div>
          <p className='flex items-center text-3xl font-adlm my-2 text-zinc-700'><BiRupee />  {toDecimal(todayRevenue)}</p>
          <p className='text-grey text-md font-adlm font-light opacity-60 px-2'>Today&apos;s Sales</p>
        </div>

        <div className="w-full  h-[140px] p-4 rounded-lg shadow-lg bg-white">
          <div className='bg-violet-400 bg-opacity-20 rounded p-2 aspect-square w-fit text-violet-500 text-lg'>
            <VscCoffee />
          </div>
          <p className='flex items-center text-3xl font-adlm my-2 text-zinc-700'> {todayOrders}</p>
          <p className='text-grey text-md font-adlm font-light opacity-60 px-2'>Today&apos;s Orders</p>
        </div>

      </div>

      <div className="overflow-x-auto w-full bg-white shadow-lg rounded-lg md:p-4 mt-4 mb-16">

        <h3 className='text-xl font-bold md:mb-8 font-adlm text-zinc-500 p-4 md:p-0'>Top Selling Products</h3>

        <Table>
          <Table.Head className="bg-white border-zinc-200 border-b-[1px]">
            <Table.HeadCell className='hidden md:block'>Id</Table.HeadCell>
            <Table.HeadCell>Image</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell className='hidden md:block'>Code</Table.HeadCell>
            <Table.HeadCell>Price</Table.HeadCell>
            <Table.HeadCell className='hidden md:block'>Category</Table.HeadCell>
            <Table.HeadCell>Sold Qty.</Table.HeadCell>
            <Table.HeadCell className='hidden md:block'>Total</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {topSelling && topSelling.map(sell => {
              return (
                <Table.Row key={sell.id} className="bg-white border-zinc-200">
                  <Table.Cell className='hidden md:block'> {sell.id}  </Table.Cell>

                  <Table.Cell>
                    {sell.image ? (
                      <Image src={sell.image} alt={sell.name} width={40} height={40} unoptimized />
                    ) : (
                      <div className="w-10 h-10 bg-violet-100 flex justify-center items-center rounded">
                        <FaRegImage />
                      </div>
                    )}
                  </Table.Cell>

                  <Table.Cell> {sell.name}
                    {sell.type && (
                      <span className='text-xs'>({sell.type})</span>
                    )}
                  </Table.Cell>

                  <Table.Cell className='hidden md:block'>{sell.code}</Table.Cell>

                  <Table.Cell>{sell.price}</Table.Cell>

                  <Table.Cell className='hidden md:block'>{sell.category}</Table.Cell>

                  <Table.Cell>{sell.total_quantity}</Table.Cell>

                  <Table.Cell className='hidden md:block'>{sell.total_price}</Table.Cell>
                </Table.Row>
              )
            })}


          </Table.Body>
        </Table>

      </div>

    </div>
  );
}
