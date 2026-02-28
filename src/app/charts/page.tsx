"use client"
import { Card, Dropdown, DropdownItem } from "flowbite-react";
import LineChart from "../components/lineChart";
import { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";

import { BiRupee } from "react-icons/bi";
import { customTheme } from "../utils/customTheme";
import { toTitleCase } from "../utils/textFormatter";
import { generalPalette } from "../common";
import BarChart from "../components/charts/barChart";
import { FiRefreshCw } from 'react-icons/fi';
import { useMenuContext } from "../context/menuContext";
import { from, forkJoin } from "rxjs";
import AutoComplete from "../components/autoComplete";
import { DatePicker } from "../components/DatePicker";



export default function Home() {
    const { menus } = useMenuContext();

    const [revenueData, setRevenueData] = useState({ x: [], y: [] })
    const [itemData, setItemData] = useState({ x: [], y: [] })
    const [earnings, setEarnings] = useState([]);
    const [interval, setInterval] = useState<'year' | 'month' | 'day' | 'range'>('day');
    const [total, setTotal] = useState(0);

    const [fromDate, setFromDate] = useState(new Date())
    const [toDate, setToDate] = useState(new Date());
    const [range, setRange] = useState('');

    const [byItem, setByItem] = useState([]);
    const [noDataMessage, setNoDataMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    const [selectedMenu, setSelectedMenu] = useState(menus[0]);
    const [menuTotal, setMenuTotal] = useState(0);


    useEffect(() => {
        setRevenueData({
            x: earnings.map(item => parseFloat(item.total_amount).toFixed(2)),
            y: earnings.map(item => interval == 'year' ? moment(item.month).format("MMM YY") : interval == 'day' ? moment(item.hour).format('HH:mm a') : moment(item.day).format('DD MMM'))
        });
    }, [earnings])

    useEffect(() => {
        setItemData({
            x: byItem.map(item => parseFloat(item.total_quantity)),
            y: byItem.map(item => interval == 'year' ? moment(item.month).format("MMM YY") : interval == 'day' ? moment(item.hour).format('HH:mm a') : moment(item.day).format('DD MMM'))
        });
    }, [byItem])

    useEffect(() => {
        if (menus.length > 0) {
            setSelectedMenu(menus[98]);
            fetchMenuData()
        }
    }, [menus])

    useEffect(() => {
        if (earnings.length == 0) {
            fetchAllData();
        }
        onInitialize();
    }, [])

    const onInitialize = () => {
        const today = new Date();
        today.setDate(today.getDate() - 7);

        setFromDate(new Date(today.toISOString().split("T")[0]));
        setToDate(new Date())
    }

    const fetchAllData = async (param = interval, rnge = range, id = selectedMenu?.id || 436) => {
        if (!rnge && param == 'range') {
            rnge = moment(fromDate).format('DD-MM-YYYY') + ',' + moment(toDate).format('DD-MM-YYYY')
        }

        const api1$ = from(axios.get(`/api/earnings?interval=${param}${rnge ? '&date=' + rnge : ''}`));
        const api2$ = from(axios.get(`/api/menu/by-item?id=${id}&interval=${param}${rnge ? '&date=' + rnge : ''}`));
        // const api3$ = from(axios.get(`/api/menu/by-category?category=Hot%20Drinks&interval=${param}${rnge ? '&date='+rnge : ''}`));

        try {
            forkJoin([api1$, api2$]).subscribe(([response1, response2]) => {
                // Handle the responses here
                console.log(response1.data);
                if (response1.data && response1.data.data && response1.data.data.length > 0) {
                    setEarnings(response1.data.data);
                    let totl = 0;
                    response1.data.data.forEach(d => totl += Number(d.total_amount));
                    setTotal(totl);
                } else {
                    setTotal(0)
                    setEarnings([])
                }

                if (response2.data && response2.data.length > 0) {
                    setByItem(response2.data);
                    let totl = 0;
                    response2.data.forEach(d => totl += Number(d.total_quantity));
                    setMenuTotal(totl);
                    setNoDataMessage("");
                } else {
                    setNoDataMessage("No items to show in Bar Chart");
                }
                console.log(response2.data);
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const refresh = () => {
        setInterval('day');
        setEarnings([]);
        setByItem([]);
        setTotal(0);
        setMenuTotal(0);
        setSelectedMenu(menus[98]);
        fetchAllData();
    }

    const fetchMenuData = async (param = interval, range1 = range, menuId?: number) => {
        // Use the provided menuId if available, otherwise use the selectedMenu's id
        const id = menuId || selectedMenu?.id || 436;
        const date = new Date('2025-05-07T05:56:06.995Z').toISOString().slice(0, 10);

        if (!range1 && param == 'range') {
            range1 = moment(fromDate).format('DD-MM-YYYY') + ',' + moment(toDate).format('DD-MM-YYYY')
        }

        // Set loading state to true before API call
        setIsLoading(true);
        setNoDataMessage(""); // Clear any previous error message

        try {
            const { data } = await axios.get(`/api/menu/by-item?id=${id}&interval=${param}${range1 ? '&date=' + range1 : ''}`);

            if (data && data.length > 0) {
                setByItem(data);

                let totl = 0;
                data.forEach(d => totl += Number(d.total_quantity));
                setMenuTotal(totl);
            } else {
                // No data returned
                setByItem([]);
                setMenuTotal(0);
                setNoDataMessage("No items to show in Bar Chart");
            }
        } catch (error) {
            console.error('Error fetching menu data:', error);
            setByItem([]);
            setMenuTotal(0);
            setNoDataMessage("No items to show in Bar Chart");
        } finally {
            // Set loading state to false after API call completes (success or error)
            setIsLoading(false);
        }

        try {
            const res = await axios.get(`/api/menu/by-category?category=Hot%20Drinks&date=${date}`)
            console.log(res)
        } catch (error) {
            console.error('Error fetching category data:', error);
        }
    }

    const onIntervalChange = (event) => {
        setInterval(event);
        fetchAllData(event)
    }

    const onSelectDate = (date) => {
        console.log(date);
        if (interval != 'range') {
            setSelectedDate(date);
            switch (interval) {
                case 'year':
                    setRange(moment(date).format('YYYY'));
                    fetchAllData(interval, moment(date).format('YYYY'), selectedMenu?.id);
                    break;
                case 'month':
                    setRange(moment(date).format('MM-YYYY'));
                    fetchAllData(interval, moment(date).format('MM-YYYY'), selectedMenu?.id);
                    break;
                case 'day':
                    setRange(moment(date).format('DD-MM-YYYY'));
                    fetchAllData(interval, moment(date).format('DD-MM-YYYY'), selectedMenu?.id);
                    break;
                default:
                    break;
            }
        } else {
            if (date[0] && date[1]) {
                const rane = moment(date[0]).format('DD-MM-YYYY') + ',' + moment(date[1]).format('DD-MM-YYYY');
                setRange(date);
                fetchAllData(interval, rane, selectedMenu?.id);
            }
        }
    };


    const randomColor = () => {
        return generalPalette[Math.floor(Math.random() * generalPalette.length)]
    };



    return (
        <section className="p-1 md:p-4 w-full">
            <Card className="w-full">
                <div className="flex flex-wrap justify-center md:justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <p className="font-adlm text-lg md:text-2xl text-green-600">Revenue Chart</p>
                        <button className="btn-icon-primary" onClick={() => refresh()}>
                            <FiRefreshCw />
                        </button>
                    </div>

                    <div className="flex justify-center md:justify-end items-center gap-4">
                        <Dropdown label={toTitleCase(interval)} theme={customTheme.Dropdown} color="light" size="sm">
                            <DropdownItem onClick={() => onIntervalChange('day')}>Day</DropdownItem>
                            <DropdownItem onClick={() => onIntervalChange('month')}>Month</DropdownItem>
                            <DropdownItem onClick={() => onIntervalChange('year')}>Year</DropdownItem>
                            <DropdownItem onClick={() => onIntervalChange('range')}>Custom Range</DropdownItem>
                        </Dropdown>

                        <div className="w-52">
                            <DatePicker
                                mode={interval}
                                value={interval == 'range' ? [fromDate, toDate] : selectedDate}
                                onChange={(date) => {
                                    onSelectDate(date);
                                }}
                            />
                        </div>


                    </div>
                </div>
            </Card>

            <Card className="w-full my-4">
                <div className="flex flex-wrap justify-center md:justify-end items-center gap-4">

                    <p className="font-adlm hidden md:flex gap-0.5 items-center text-secondary">
                        <span className="text-base md:text-2xl"><BiRupee /></span>
                        <span className="text-base md:text-2xl">{total} </span>
                        {interval == 'range' && (
                            <span className="text-xs md:test-sm text-grey ml-2">
                                ({moment(fromDate).format('DD/MM/YYYY')} to {moment(toDate).format('DD/MM/YYYY')})
                            </span>
                        )}
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center h-[250px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6B7B4E]"></div>
                    </div>
                ) : revenueData.x.length == 0 ? (
                    <div className="flex items-center justify-center h-[250px]">
                        <p className="text-lg font-medium text-gray-500">
                            No items to show in Line Chart
                        </p>
                    </div>
                ) : (
                    <div className='h-[250px] w-full'>
                        <LineChart data={revenueData} color={'#00c951'} />
                    </div>
                )}

                {revenueData.x.length}


                <p className="font-adlm flex md:hidden gap-0.5 items-center justify-center text-secondary text-center">
                    <span className="text-lg md:text-2xl"><BiRupee /></span>
                    <span className="text-lg md:text-2xl">{total} </span>
                    {interval == 'range' && (
                        <span className="text-xs md:test-sm text-grey ml-2">
                            ({moment(fromDate).format('DD/MM/YYYY')} to {moment(toDate).format('DD/MM/YYYY')})
                        </span>
                    )}
                </p>
            </Card>

            <Card className="w-full my-4">
                <div className="flex flex-col-reverse md:flex-row flex-wrap justify-between items-center">

                    <div className="w-full md:w-1/4">
                        <AutoComplete
                            items={menus}
                            displayKey={'name'}
                            defaultValue={selectedMenu?.name}
                            onSelect={(item) => {
                                if(typeof item == 'object'){ 
                                    setSelectedMenu(item);
                                    fetchMenuData(interval, range, item.id);
                                }
                            }}
                            placeholder="Search menu items..."

                        />
                    </div>

                    {selectedMenu && (
                        <p className="font-adlm text-lg md:text-2xl text-[#F28E2B]">{selectedMenu?.name}</p>
                    )}

                    {selectedMenu && (
                        <div className="flex flex-col items-center">
                            <p className="font-adlm flex gap-0.5 items-center ">
                                <span className="text-sm md:text-base text-primary">{menuTotal}</span>
                                <span className="text-zinc-600">&nbsp;x&nbsp;</span>
                                <span className="text-sm md:text-base text-primary">{selectedMenu.price}</span>
                                <span className="text-zinc-600">=</span>
                                <span className="text-base md:text-xl text-secondary"><BiRupee /></span>
                                <span className="text-base md:text-2xl text-secondary">{menuTotal * selectedMenu.price}</span>
                            </p>
                        </div>
                    )}


                </div>
                <div className='h-[250px] w-full relative'>
                    {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6B7B4E]"></div>
                        </div>
                    ) : noDataMessage ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-lg font-medium text-gray-500">{noDataMessage}</p>
                        </div>
                    ) : (
                        <BarChart color={randomColor()} data={itemData} />
                    )}
                </div>
            </Card>

        </section>
    )
}
