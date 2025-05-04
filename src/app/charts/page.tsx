"use client"
import { Card, Datepicker, Dropdown, DropdownItem, ListGroup, ListGroupItem, Popover } from "flowbite-react";
import LineChart from "../components/lineChart";
// import PieChart from "../components/pieChart";
import { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";

import { BiRupee } from "react-icons/bi";
import { customTheme } from "../utils/customTheme";
import { toTitleCase } from "../utils/textFormatter";
import { IoMdCalendar } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { months } from "../common";
import CalendarPicker from "../components/Calender";




export default function Home() {
    const [revenueData, setRevenueData] = useState({x:[], y:[]})
    const [earnings, setEarnings] = useState([]);
    const [interval, setInterval] = useState<'year' | 'month' | 'day' | 'custom range'>('day');
    const [total, setTotal] = useState(0);
    const [openRangeModal, setOpenRangeModal] = useState(false);
    const [fromDate, setFromDate] = useState(new Date())
    const [toDate, setToDate] = useState(new Date());
    const [showRangeErr, setRangeErr] = useState(false);
    const [selectedMonth, setMonth] = useState(months[new Date().getMonth()]);
    const [selectedYear, setYear] = useState(new Date().getFullYear())

    useEffect(() => {

        setRevenueData({
          x: earnings.map(item => parseFloat(item.total_amount)),
          y: earnings.map(item => interval == 'year' ? moment(item.month).format("MMM YY") : interval == 'day' ?  moment(item.hour).format('HH:mm a') : moment(item.day).format('DD MMM'))
        });
    },[earnings])

    useEffect(() =>{
        if(earnings.length == 0){
            fetchEarnings();
        }
        onInitialize();
    },[])

    const onInitialize = () =>{
        const today = new Date();
        today.setDate(today.getDate() - 7); 
        
        setFromDate(new Date (today.toISOString().split("T")[0]));
        setToDate(new Date())
        setRangeErr(false);
        // setMonth(new Date().getMonth())
    }

    const fetchEarnings = async (param = interval, range? ) => {
        if(!range && param == 'custom range') {
            range = moment(fromDate).format('YYYY-MM-DD')+','+moment(toDate).format('YYYY-MM-DD')
        }
        try {
          const { data } = await axios.get(`/api/earnings?interval=${param}${range ? '&date='+range : ''}`);

          if (data.data && data.data.length > 0) {
            setEarnings(data.data);
    
            let totl = 0;
            data.data.forEach(d => totl += Number(d.total_amount));
            setTotal(totl);
          }else{
            setTotal(0)
            setEarnings([])
          }
    
        } catch (error) {
          console.error('Error fetching order Earnings:', error);
        }
    }

    const onIntervalChange = (event) =>{
        setInterval(event);
        fetchEarnings(event)
    }

    const fetchCustomRange = () =>{
        setOpenRangeModal(false);
        const range = moment(fromDate).format('YYYY-MM-DD')+','+moment(toDate).format('YYYY-MM-DD');
        fetchEarnings(interval, range)
    }
    
    const onChangeRangeHandle = (e, type) =>{
        if(type == 'from'){
            setFromDate(e);
            setRangeErr(e > toDate);
        }else{
            setToDate(e);
            setRangeErr(fromDate > e);
        }
    }

    const onSelectMonth =(ind)=>{
        setMonth(months[ind]);
        fetchEarnings('month', (ind < 10 ? '0' : '')+(ind+1)+'-'+selectedYear)
    }

    const onSelectYear = (e) =>{
        console.log(e.target.value);
        setYear(e.target.value);
    }

    const onSelectDate = (e) =>{
        // let date = moment(e).format('dd-MM-YYYY');
        fetchEarnings('day', e)
    }

    const closeHandler = () =>{
        onInitialize();
        setOpenRangeModal(false);
    }

    function getYears() {
        const startYear = 2025;
        const currentYear = new Date().getFullYear();
        const years = [];

        for (let year = startYear; year <= currentYear; year++) {
            years.push(year);
        }
        return years;
    }

    
    return (
        <section className="p-1 md:p-4 w-full">
            <Card className="w-full">
                <div className="flex flex-wrap justify-between items-center">
                    <p className="font-adlm text-lg md:text-2xl text-green-600">Revenue Chart</p>
                    <p className="font-adlm hidden md:flex gap-0.5 items-center text-orange-700">
                        <span className="text-base md:text-2xl"><BiRupee/></span>
                        <span className="text-base md:text-2xl">{total} </span>
                        {interval == 'custom range' && (
                            <span className="text-xs md:test-sm text-grey ml-2">
                                ({moment(fromDate).format('DD/MM/YYYY')} to {moment(toDate).format('DD/MM/YYYY')})
                            </span>
                        )}
                    </p>
                    <div className="flex items-center gap-2">
                        <Dropdown label={toTitleCase(interval)} theme={customTheme.Dropdown} color="light" size="sm">
                            <DropdownItem onClick={() => onIntervalChange('day')}>Day</DropdownItem>
                            <DropdownItem onClick={() => onIntervalChange('month')}>Month</DropdownItem>
                            <DropdownItem onClick={() => onIntervalChange('year')}>Year</DropdownItem>
                            <DropdownItem onClick={() => onIntervalChange('custom range')}>Custom Range</DropdownItem>
                        </Dropdown>

                        {interval == 'custom range' && (
                            <button className="rounded-none btn-primary-lite " color="gray" onClick={()=> setOpenRangeModal(true)}>
                                <IoMdCalendar className="text-xl"/>
                            </button>
                        )}
                        {interval == 'month' && (

                            <Popover content={
                                <div className="w-52 text-sm text-gray-500 dark:text-gray-400">
                                    <div className="py-2 px-4 ">
                                        <select id="monthyear" value={selectedYear} className="w-24 h-9 p-2 mx-auto" onChange={() => onSelectYear}>
                                            {getYears().map(year => (
                                                <option value={year} key={year}>{year}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="pt-2 max-h-60 overflow-auto">
                                        <ListGroup className="w-full">
                                            {months.map((mnt, ind) => (
                                                <ListGroupItem key={mnt} onClick={() => onSelectMonth(ind)}>{mnt}</ListGroupItem>
                                            ))}
                                        </ListGroup>
                                    </div>
                                </div>
                            } trigger="click">
                                <button className="btn-light-outline">{selectedMonth}</button>
                            </Popover>
                        )}
                        {interval == 'day' && (
                            <CalendarPicker
                                popupPosition="below"
                                minDate="02-03-2025"
                                maxDate={moment(new Date()).format('DD-MM-YYYY')}
                                format="d-m-Y"
                                value={moment(new Date()).format('DD-MM-YYYY')}
                                onChange={(dates, str) => onSelectDate(str)}
                            />
                        )}
                    </div>
                </div>
                <div className='h-[250px] w-full'>
                    <LineChart data={revenueData} color={'#00c951'} />
                </div>

                <p className="font-adlm flex md:hidden gap-0.5 items-center justify-center text-orange-700 text-center">
                        <span className="text-lg md:text-2xl"><BiRupee/></span>
                        <span className="text-lg md:text-2xl">{total} </span>
                        {interval == 'custom range' && (
                            <span className="text-xs md:test-sm text-grey ml-2">
                                ({moment(fromDate).format('DD/MM/YYYY')} to {moment(toDate).format('DD/MM/YYYY')})
                            </span>
                        )}
                </p>
            </Card>

            {/* Range Modal */}
           {openRangeModal && (
                <div className="absolute top-0 left-0 w-screen h-screen p-16 bg-black bg-opacity-50 flex justify-center items-start">
                    <Card className="w-fit animate-slideUp">
                        <div className="flex justify-between items-center">
                            <h1 className="text-black text-2xl font-acme text-center">Select Range</h1>
                            <button className="btn-light btn-icon ml-auto" onClick={closeHandler}>
                                <IoClose className="text-xl"/>
                            </button>
                        </div>
                        <div className="flex items-center text-grey gap-3 mt-10">
                            <Datepicker className="w-80 datepicker" minDate={new Date(2025, 2, 2)} maxDate={new Date()} value={fromDate}  onChange={(e) => onChangeRangeHandle(e, 'from')} theme={customTheme.DatePicker} />
                                to
                            <Datepicker className="w-80 datepicker" minDate={new Date(2025, 2, 2)} maxDate={new Date()} value={toDate} onChange={(e) => onChangeRangeHandle(e, 'to')}  />
                        </div>

                        {showRangeErr && (
                            <p className="text-sm text-red-700">&apos;From Date&apos; cannot be after &apos;To Date&apos;.</p>
                        )}

                        <div className="flex justify-center gap-4 px-10 mt-10">
                            <button className="btn-light" onClick={closeHandler}>
                                Cancel
                            </button>
                            <button className="btn-primary" onClick={fetchCustomRange} disabled={showRangeErr}>
                                Fetch
                            </button>
                        </div>
                    </Card>
                </div>
           )}

           {/* <Card className="w-full">
                <div className='h-[350px] w-full'>
                    <PieChart color={""}  />
                </div>
           </Card> */}
        </section>
    )
}