"use client"
import { useEffect, useState } from "react";
import { IoSearch, IoGridOutline, IoList } from "react-icons/io5";
import { BiRupee } from "react-icons/bi";
import { FaRegImage } from "react-icons/fa6";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { BiSolidCart } from "react-icons/bi";

import { useMenuContext } from "../context/menuContext";
import { BillMenu, Menu } from "../common";
import { Table } from "flowbite-react";
import moment from "moment";
import axios from "axios";
import { FaLeaf } from "react-icons/fa";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { FaChevronRight } from "react-icons/fa6";
import Image from "next/image";



export default function Home() {
    const { menus } = useMenuContext();

    const [search, setSearch] = useState('')
    const [menuList, setMenuList] = useState<BillMenu[]>([]);
    const [filteredMenu, setFilteredMenu] = useState<BillMenu[]>([])
    const [categoryList, setCategoryList] = useState<string[]>([]);
    // const [varientList, setVarientList] = useState([]);
    // const [cartList, setCartList] = useState<BillMenu[]>([])

    const [subCategory, setSubCategory] = useState('');
    // const [varient, setVarient] = useState<'veg' | 'nonveg' | 'egg'>('veg');

    const [selectedCategory, setSelectedCategory] = useState('');
    const [subTotal, setSubTotal] = useState(0);
    const [total, setTotal] = useState(0);
    const [discount, setDiscount] = useState(0);

    const [lastId, setLastId] = useState<number>(0);
    const [billTime, setBillTime] = useState("");

    const [layout, setLayout] = useState('list');
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (menus && menus.length) {
            const cate = Array.from(new Set(menus?.map((menu) => menu.category)));
            const vary = Array.from(new Set(menus?.map((menu) => menu.type).filter(typ => typ)));
            vary.unshift('')
            setCategoryList(cate);
            // setVarientList(vary);
            setMenuList(menus);
            setFilteredMenu(menus);
            getLastId();
            setSubCategory('')
        }
    }, [menus])

    useEffect(() => {
        doSearchFilter()
        let total = 0;
        menuList.filter(menu => menu.isAdded)?.forEach(item => {
            total += item.price * item.quantity
        });
        setSubTotal(total);
        if (discount) {
            setTotal(Number((total - ((discount / 100) * total)).toFixed(2)));
        } else {
            setTotal(total);
        }
    }, [selectedCategory, search, menuList, discount]);

    function doSearchFilter() {
        const searchFilter = menuList.filter(mn => {
            const matchesSearch = search
                ? mn.name.toLowerCase().includes(search.toLowerCase())
                : true;

            const matchesCategory =
                selectedCategory.length === 0 || selectedCategory.includes(mn.category);

            let matchSubCategory = true;
            if (selectedCategory.includes('Momo') && subCategory) {
                matchSubCategory = mn.type == subCategory;
            }

            return matchesSearch && matchesCategory && matchSubCategory;
        });

        setFilteredMenu(searchFilter);
    }

    function onAdd(menu: BillMenu) {
        setMenuList(list =>
            list.map(item => item.id == menu.id ? { ...item, isAdded: true, quantity: 1 } : item)
        );
        // setCartList(items => [...items, menu])
    }

    function onIncrease(menu: BillMenu) {
        setMenuList(list =>
            list.map(item => item.id == menu.id ? { ...item, quantity: Number(item.quantity) + 1 } : item)
        )
    }

    function onDecrease(menu: BillMenu) {
        if (menu.quantity > 1) {
            setMenuList(list =>
                list.map(item => item.id == menu.id ? { ...item, quantity: Number(item.quantity) - 1 } : item)
            )
        } else {
            setMenuList(list =>
                list.map(item => item.id == menu.id ? { ...item, quantity: 0, isAdded: false } : item)
            )
        }

    }

    const getLastId = async () => {
        const { data } = await axios.get('/api/order-id');
        if (data && data.lastId) {
            setLastId(data.lastId)
        }
    }

    async function onGenerateBill(isPrint?: boolean) {
        setLoading(true)
        
        try {

            const billList: Menu[] = menuList.filter(menu => menu.isAdded).map(itm => { return { ...itm, id: 0, menu_id: itm.id, price: Number(itm.price) } });

            const response = await fetch('api/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    customer_name: 'Cashier',
                    items: billList,
                    discount: discount,
                    date: new Date()
                })
            });

            if (!response.ok) {
                alert('Internal Error. Print after sometimes')
            } else {
                if (isPrint) {
                    setBillTime(new Date().toLocaleString())
                    window.print();
                }

                setDiscount(0);
                setMenuList(list => list.map(item => item.isAdded ? { ...item, isAdded: false, quantity: 0 } : item));
                setSubTotal(0);
                setTotal(0);
            }
            setLoading(false)
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Internal Error. Print after sometimes');
            setLoading(false)
        }
    }

    const openCart = () =>{
        
    }


    return (
        <>
            <section className="p-3 w-full h-[93%] print:hidden flex gap-2">

                {menuList && lastId ? (
                     <div className="w-full md:w-[70%] flex flex-col gap-2 h-full items-center">
                        <div className="bg-white p-3 shadow rounded h-[70px] w-full no-print flex justify-between items-center">
                            <div className="relative w-full md:w-[500px]">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-grey">
                                    <IoSearch />
                                </div>
                                <input type="text" id="search" className="bg-transparent border border-slate-200 text-grey text-sm rounded-lg focus:ring-orange-500 focus:border-amber-300 block w-full ps-10 p-2.5  dark:bg-grey dark:border-grey dark:placeholder-grey dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-400" placeholder="Search Items..." autoFocus required onChange={(e) => setSearch(e.target.value)} />
                            </div>
    
                            <div className="hidden md:flex rounded bg-gray-100 p-1 ml-auto">
                                <label htmlFor="list" className={`p-1.5 cursor-pointer rounded text-md ${layout == 'list' ? 'bg-white shadow text-orange-500' : 'text-grey'}`}>
                                    <input type="radio" name="layout" id="list" value={layout} className='hidden' onChange={() => setLayout('list')} />
                                    <IoList/>
                                </label>
    
                                <label htmlFor="grid" className={`p-1.5 cursor-pointer rounded text-md ${layout == 'grid' ? 'bg-white shadow text-orange-500' : 'text-grey'}`}>
                                    <input type="radio" name="layout" id="grid" value={layout} className='hidden' onChange={() => setLayout('grid')} />
                                    <IoGridOutline />
                                </label>
                            </div>
                        </div>
    
                        <div className="flex gap-2 h-[92%] w-full no-print">
                            <div className="hidden md:block bg-white px-1 shadow rounded h-full overflow-auto min-w-[85px]">
                                {categoryList && categoryList.map(cate => (
                                    <button key={cate} className={`p-2 my-1 flex flex-col justify-center items-center border border-gray-300 w-[80px] h-auto text-sm font-adlm  ${selectedCategory == cate ? 'text-orange-500 border-orange-500' : 'grayscale opacity-70'}`} onClick={() => setSelectedCategory(selectedCategory == cate ? '' : cate)}>
                                        <Image src={`/icons/${cate}.svg`} width={40} height={40} alt={cate} />
                                        <p className="text-wrap">{cate}</p>
                                    </button>
                                ))}
                            </div>
    
    
                            <div className="bg-white shadow rounded p-2 w-full h-full overflow-auto">
                                {layout == 'grid' ? (   
                                    <div className="h-fit grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                        {filteredMenu && filteredMenu.map((menu) => (
    
                                            <div key={menu.id} className="border border-gray-100 p-1 h-full max-h-fit shadow rounded">
                                                <div className="relative">
                                                    {menu.image ? (
                                                        <img src={menu.image.toString()} alt={menu.name} width={100} height={100} className="w-full aspect-[5/3] rounded" />
                                                    ) : (
                                                        <div className="bg-gray-200 w-full aspect-[5/3] flex justify-center items-center rounded">
                                                            <FaRegImage />
                                                        </div>
                                                    )}
                                                    <p className="text-white bg-black bg-opacity-35 font-adlm text-xs px-2.5 py-0.5 absolute bottom-0 right-0 rounded-sm">{menu.category}</p>
                                                </div>
    
                                                <div className="mt-2">
                                                    <p className="font-adlm text-sm">{menu.name} <span className="ml-2 text-xs text-gray-400">{menu.type}</span></p>
    
                                                    <div className="flex justify-between mt-2">
                                                        <p className="font-adlm text-lg flex items-center">
                                                            <BiRupee /> {menu.price}
                                                        </p>
    
                                                        {!menu.isAdded ? (
                                                            <button className="btn-primary-lite font-adlm py-3 text-sm w-[100px] h-8 hover:bg-orange-500 hover:text-white" onClick={() => onAdd(menu)}>Add</button>
                                                        ) : (
                                                            <div className="flex items-center w-fit">
                                                                <button className="font-adlm text-sm w-8 h-8 p-2 aspect-square bg-gray-200 hover:bg-orange-500 hover:text-white" onClick={() => onDecrease(menu)}>
                                                                    <FaMinus />
                                                                </button>
                                                                <p className="text-primary px-3">{menu.quantity}</p>
                                                                <button className="font-adlm text-sm w-8 h-8 p-2 aspect-square bg-gray-200 hover:bg-orange-500 hover:text-white" onClick={() => onIncrease(menu)}>
                                                                    <FaPlus />
                                                                </button>
                                                            </div>
                                                        )}
    
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <Table className="w-full h-full">
                                        <Table.Head>
                                            <Table.HeadCell className="bg-zinc-500 bg-opacity-5 text-zinc-900">Id</Table.HeadCell>
                                            <Table.HeadCell colSpan={2} className="bg-zinc-500 bg-opacity-5 text-zinc-900">Name</Table.HeadCell>
                                            <Table.HeadCell className="bg-zinc-500 bg-opacity-5 text-zinc-900">Price</Table.HeadCell>
                                            <Table.HeadCell className="bg-zinc-500 bg-opacity-5 text-zinc-900">
                                                Add to Cart
                                            </Table.HeadCell>
                                        </Table.Head>
                                        <Table.Body>
                                        {filteredMenu && filteredMenu.map((menu, ind) => (
                                            <Table.Row key={menu.code+''+ind}>
                                                <Table.Cell>{menu.id}</Table.Cell>
                                                <Table.Cell className="font-adlm">{menu.name}</Table.Cell>
                                                <Table.Cell></Table.Cell>
                                                <Table.Cell>
                                                    <p className="font-adlm text-base flex items-center">
                                                        <BiRupee /> {menu.price}
                                                    </p>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {!menu.isAdded ? (
                                                        <button className="btn-primary-lite font-adlm py-3 text-sm w-[100px] h-8 hover:bg-orange-500 hover:text-white" onClick={() => onAdd(menu)}>Add</button>
                                                    ) : (
                                                        <div className="flex items-center w-fit">
                                                            <button className="font-adlm text-sm w-8 h-8 p-2 aspect-square bg-gray-200 hover:bg-orange-500 hover:text-white" onClick={() => onDecrease(menu)}>
                                                                <FaMinus />
                                                            </button>
                                                            <p className="text-primary px-3">{menu.quantity}</p>
                                                            <button className="font-adlm text-sm w-8 h-8 p-2 aspect-square bg-gray-200 hover:bg-orange-500 hover:text-white" onClick={() => onIncrease(menu)}>
                                                                <FaPlus />
                                                            </button>
                                                        </div>
                                                    )}
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                        </Table.Body>
                                    </Table>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="w-full md:w-[70%] h-full bg-white shadow rounded flex flex-col justify-center items-center">
                        <div className="w-56 h-56">
                            <DotLottieReact
                                src={'/lottie/load_food.lottie'}
                                loop
                                autoplay
                                width={100}
                                height={100}
                                speed={1}
                            />
                        </div>
                        <p className="text-orange-400 font-acme text-center text-lg">Wait for a minute... <br/> <span className="text-base"> or check you internet connection and reload the page again.</span></p>
                    </div>
                )}
               

                <div className="bg-white shadow rounded w-[30%] h-full overflow-auto hidden md:flex flex-col relative">
                    
                    <div className="h-[8%] bg-orange-500 p-4 bg-opacity-15 text-orange-500 font-adlm flex justify-between items-center sticky top-0 z-10">
                        <p className="text-xl">Cart List</p>
                        <p className="text-3xl"><BiSolidCart /></p>
                    </div>

                    <div className="p-2 h-[64%] overflow-auto">
                        <Table>
                            <Table.Body>
                                {menuList.filter(menu => menu.isAdded).map(cart => (
                                    <Table.Row key={cart.id}>
                                        <Table.Cell className="pl-0 pr-1 py-3" colSpan={2}>{cart.name}</Table.Cell>
                                        <Table.Cell className="pl-0 pr-2 py-3">
                                            <div className="flex items-center w-fit">
                                                <button className="font-adlm text-sm w-8 h-8 p-2 aspect-square bg-gray-200 hover:bg-orange-500 hover:text-white rounded-full" onClick={() => onDecrease(cart)}>
                                                    <FaMinus />
                                                </button>
                                                <p className="text-primary px-3">{cart.quantity}</p>
                                                <button className="font-adlm text-sm w-8 h-8 p-2 aspect-square bg-gray-200 hover:bg-orange-500 hover:text-white rounded-full" onClick={() => onIncrease(cart)}>
                                                    <FaPlus />
                                                </button>
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell className="px-2 py-3">
                                            <p className="font-adlm text-base flex items-center">
                                                <BiRupee /> {Number(cart.price) * cart.quantity}
                                            </p>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </div>
                    
                    <div className="h-fit w-full mt-auto sticky bottom-0 z-10 bg-white shadow border-t">
                        
                        <Table className="w-full h-full">
                            <Table.Body className="w-full">
                                <Table.Row>
                                    <Table.Cell className="text-sm font-adlm p-2">Sub Total</Table.Cell>
                                    <Table.Cell className="text-sm font-adlm flex items-center p-2">
                                        <BiRupee /> {subTotal}
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell className="font-adlm p-2">Discount</Table.Cell>
                                    <Table.Cell className="p-2 w-32">
                                        <span className="font-adlm">%</span> <input type="number" defaultValue={discount} min={0} max={100} name="discount" onChange={(e) => setDiscount(Number(e.target.value))} className="bg-transparent rounded border-slate-200 text-grey font-adlm h-8 text-sm focus:ring-orange-500  focus:border-orange-500" />
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell className="text-lg font-adlm p-2 text-black">Total</Table.Cell>
                                    <Table.Cell className="text-lg font-adlm flex items-center p-2 text-black">
                                        <BiRupee className="text-xl" /> {total}
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row >
                                    <Table.Cell className="text-lg font-adlm p-2 text-black">
                                        <button className="bg-yellow-300 w-28" onClick={() => onGenerateBill(true)} disabled={subTotal == 0}>Print</button>
                                    </Table.Cell>

                                    <Table.Cell className="text-lg font-adlm p-2 text-black">
                                        <button className="btn-primary w-28" disabled={subTotal == 0} onClick={() => onGenerateBill()}>Save</button>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>

                    </div>

                    {loading && (
                        <div className="absolute bg-white/30 bg-opacity-25 w-full h-full z-10 flex justify-center items-center backdrop-blur-sm">
                            <p className="text-orange-800 font-acme">Wait for a while...</p>
                        </div>
                    )}
                </div>

            </section>

            <div className="print-container hidden print:flex flex-col items-center gap-2 print:w-full">
                <Image src={'/tibet-logo.png'} width={100} height={100} alt='Hexa Bees' className="w-[60%] h-16" lazyBoundary=""/>
                <p className="text-center text-xs w-3/4">6/11, MGR Road,  GEM Hospital opposite, Kandanchanvadi.</p>
                <p className="font-adlm text-sm text-center ">+91 637 924 1773</p>
                <p className="w-full text-center text-sm ">Bill Id : {lastId}</p>
                {billTime &&
                    <p className="text-center text-sm w-full pb-3 border-b border-dotted border-grey">{moment(billTime).format('ddd  MMM DD YYYY - hh:mm:ss a')}</p>
                }

                <div className="w-full grid grid-cols-4 gap-2">
                    <p className="text-center font-adlm col-span-2 text-sm">Name</p>
                    <p className="text-center font-adlm text-sm">Qty</p>
                    <p className="text-center font-adlm text-sm">Price</p>
                </div>
                {menuList.filter(menu => menu.isAdded).map(cart => (
                    <div className="w-full grid grid-cols-4 gap-2 items-center justify-end" key={cart.id}>
                        <p className="text-left col-span-2 text-sm">{cart.name}</p>
                        <p className="text-center text-sm">{cart.quantity}</p>
                        <p className="text-right flex items-center justify-end text-sm"> <BiRupee /> {cart.price * cart.quantity}</p>
                    </div>
                ))}


                <div className="w-full my-2">

                    <div className="w-full grid grid-cols-3 gap-3 border-y border-dotted border-grey py-2">
                        <p className="col-span-2 text-grey">Sub Total</p>
                        <p className=" flex items-center justify-end gap-1 text-right"> <BiRupee /> {subTotal}</p>

                        <p className="col-span-2 text-grey">Discount</p>
                        <p className=" flex items-center justify-end gap-1 text-right"> <span className="font-adlm">%</span> {discount}</p>
                    </div>

                    <div className="w-full grid grid-cols-3 py-1 border-b border-dotted border-grey">
                        <p className="text-xl font-adlm col-span-2">Total</p>
                        <p className="text-lg font-adlm flex items-center justify-end gap-1 text-right"> <BiRupee /> {total}</p>
                    </div>
                </div>

                <h6 className="w-full py-2 flex items-center justify-center gap-4 text-lg text-center font-acme opacity-50">Save Paper!! <span><FaLeaf /></span> Save Tree!!</h6>
            </div>

            {menuList.filter(menu => menu.isAdded).length && (
                <div className="w-full absolute z-50 bottom-5 left-0 mx-auto block md:hidden">
                    <div className="h-16 py-2 px-4 flex items-center rounded-full bg-orange-500 w-fit gap-4 mx-auto" onClick={() => openCart}>
                        <button className="w-12 h-12 rounded-full bg-gray-200 font-acme text-xl text-grey">{menuList.filter(menu => menu.isAdded).length}</button>
                        <p className="text-white font-adlm">View Cart <br /><span className="text-sm">items added</span> </p>
                        <p className="text-white text-xl font-adlm flex items-center"><BiRupee className="text-xl"/> {total}</p>
                        <button className="w-12 h-12 rounded-full bg-orange-600 flex justify-center items-center aspect-square">
                            <FaChevronRight  className="text-xl text-white"/>
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

