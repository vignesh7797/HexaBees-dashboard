"use client"
import { useEffect, useState } from "react";
import { IoSearch, IoGridOutline, IoList, IoClose, IoImageOutline } from "react-icons/io5";
import { BiRupee } from "react-icons/bi";
import { FaRegImage } from "react-icons/fa6";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { BiSolidCart } from "react-icons/bi";

import { useMenuContext } from "../context/menuContext";
import { Bill, BillMenu, Menu } from "../common";
import { Modal, ModalBody, Table } from "flowbite-react";
import axios from "axios";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { FaChevronRight } from "react-icons/fa6";
import Image from "next/image";
import BillTemplate from "../components/billTemplate";
import { MdAddShoppingCart } from "react-icons/md";




export default function Home() {
    const { menus } = useMenuContext();

    const [search, setSearch] = useState('')
    const [menuList, setMenuList] = useState<BillMenu[]>([]);
    const [filteredMenu, setFilteredMenu] = useState<BillMenu[]>([])
    const [categoryList, setCategoryList] = useState<string[]>([]);

    const [subCategory, setSubCategory] = useState('');

    const [selectedCategory, setSelectedCategory] = useState('');
    const [subTotal, setSubTotal] = useState(0);
    const [total, setTotal] = useState(0);
    const [discount, setDiscount] = useState(0);

    const [lastId, setLastId] = useState<number>(0);

    const [layout, setLayout] = useState('list');
    const [loading, setLoading] = useState(false);

    const [billOrder, setBillOrder] = useState<Bill>();
    const [cartModal, setCartModal] = useState(false);

    useEffect(() => {
       const handleResize = () => {
            const width = window.innerWidth;
            if (width < 768) {
                setLayout('grid');
            } else {
                setLayout('list');
            }
        };

        // Set initial size
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Remove event listener on cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, [])

    useEffect(() => {
        if (menus && menus.length) {
            const cate = Array.from(new Set(menus?.map((menu) => menu.category)));
            const vary = Array.from(new Set(menus?.map((menu) => menu.type).filter(typ => typ)));
            vary.unshift('')

            setCategoryList(cate);
            setMenuList(menus);
            setFilteredMenu(menus);
            getLastId();
            setSubCategory('')
        }
    }, [menus])

    useEffect(() => {
        doSearchFilter()
        let total = 0;
        menuList.filter(menu => menu.isAdded)?.forEach(menu => {
            total += menu.price * menu.quantity
        });

        setSubTotal(total);
        if (discount) {
            setTotal(Number((total - ((discount / 100) * total)).toFixed(2)));
        } else {
            setTotal(total);
        }

        sessionStorage.setItem('cart', JSON.stringify(menuList.filter(menu => menu.isAdded)));
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
        try {
            const { data } = await axios.get('/api/order-id');
            if (data && data.lastId) {
                setLastId(data.lastId)
            }
        } catch (error) {    
            console.error('Error fetching last ID:', error);
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
                    window.print();
                }

                setDiscount(0);
                setMenuList(list => list.map(item => item.isAdded ? { ...item, isAdded: false, quantity: 0 } : item));
                setSubTotal(0);
                setTotal(0);
                setSearch('');
                setSelectedCategory('');
                setCartModal(false);
            }
            setLoading(false)
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Internal Error. Print after sometimes');
            setLoading(false)
        }
    }

    useEffect(() =>{
        const bill:Bill = {
            id : lastId,
            customer_name: 'Cashier',
            total_amount : total,
            sub_total : subTotal,
            discount : discount,
            products : menuList.filter(menu => menu.isAdded),
            date : new Date()
        }
        if(bill.products.length > 0){
            setBillOrder(bill);
        }
    },[total, subTotal, discount, menuList])


    return (
        <>
            <section className="p-1 md:p-3 w-full h-[93%] print:hidden flex gap-2">

                {menuList && lastId ? (
                     <div className="w-full md:w-[70%] flex flex-col gap-2 h-full items-center">
                        <div className="bg-white p-2 md:p-3 shadow rounded h-[70px] w-full no-print flex justify-between items-center">
                            <div className="relative w-full md:w-[500px]">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-grey">
                                    <IoSearch />
                                </div>
                                <input type="text" id="search" className="bg-transparent border border-slate-200 text-grey text-sm rounded-lg focus:ring-primary focus:border-amber-300 block w-full ps-10 p-2.5  dark:bg-grey dark:border-grey dark:placeholder-grey dark:text-white dark:focus:ring-primary dark:focus:border-primary" placeholder="Search Items..." autoFocus required onChange={(e) => setSearch(e.target.value)} />
                            </div>
    
                            <div className="hidden md:flex rounded bg-gray-100 p-1 ml-auto">
                                <label htmlFor="list" className={`p-1.5 cursor-pointer rounded text-md ${layout == 'list' ? 'bg-white shadow text-primary' : 'text-grey'}`}>
                                    <input type="radio" name="layout" id="list" value={layout} className='hidden' onChange={() => setLayout('list')} />
                                    <IoList/>
                                </label>
    
                                <label htmlFor="grid" className={`p-1.5 cursor-pointer rounded text-md ${layout == 'grid' ? 'bg-white shadow text-primary' : 'text-grey'}`}>
                                    <input type="radio" name="layout" id="grid" value={layout} className='hidden' onChange={() => setLayout('grid')} />
                                    <IoGridOutline />
                                </label>
                            </div>
                        </div>
    
                        <div className="flex gap-2 h-[93%] md:h-[92%] w-full no-print">
                            <div className="hidden md:block bg-white px-1 shadow rounded h-full overflow-auto min-w-[85px]">
                                {categoryList && categoryList.map(cate => (
                                    <button key={cate} className={`p-2 my-1 flex flex-col justify-center items-center border border-gray-300 w-[80px] h-auto text-sm font-adlm  ${selectedCategory == cate ? 'text-primary border-primary' : 'grayscale opacity-70'}`} onClick={() => setSelectedCategory(selectedCategory == cate ? '' : cate)}>
                                        <Image src={`/icons/${cate}.svg`} width={40} height={40} alt={cate} />
                                        <p className="text-wrap">{cate}</p>
                                    </button>
                                ))}
                            </div>
    
    
                           <div className="bg-white shadow rounded p-2 w-full h-full overflow-hidden flex flex-col justify-between gap-2">
                                <div className="h-full overflow-auto">
                                    {layout == 'grid' ? (   
                                        <div className="h-fit grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 pb-20 md:pb-4">
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
                                                        <p className="font-adlm text-xs md:text-sm">{menu.name} <span className="ml-2 text-xs text-gray-400">{menu.type}</span></p>
        
                                                        <div className="flex justify-between mt-2">
                                                            <p className="font-adlm text-sm md:text-lg flex items-center">
                                                                <BiRupee /> {menu.price}
                                                            </p>
        
                                                            {!menu.isAdded ? (
                                                                <button className="btn-primary-lite font-adlm py-3 text-sm w-[100px] h-8 hover:bg-primary hover:text-white" onClick={() => onAdd(menu)}>Add</button>
                                                            ) : (
                                                                <div className="flex items-center w-fit">
                                                                    <button className="font-adlm text-sm w-8 h-8 p-2 aspect-square bg-gray-200 hover:bg-primary hover:text-white" onClick={() => onDecrease(menu)}>
                                                                        <FaMinus />
                                                                    </button>
                                                                    <p className="text-primary px-3">{menu.quantity}</p>
                                                                    <button className="font-adlm text-sm w-8 h-8 p-2 aspect-square bg-gray-200 hover:bg-primary hover:text-white" onClick={() => onIncrease(menu)}>
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
                                                    <Table.Cell className="font-adlm">{menu.name} 
                                                        {menu.type && (
                                                            <span className="text-xs opacity-55">({menu.type})</span>
                                                        )}
                                                    </Table.Cell>
                                                    <Table.Cell></Table.Cell>
                                                    <Table.Cell>
                                                        <p className="font-adlm text-base flex items-center">
                                                            <BiRupee /> {menu.price}
                                                        </p>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {!menu.isAdded ? (
                                                            <button className="btn-primary-lite font-adlm py-3 text-sm w-[100px] h-8 hover:bg-primary hover:text-white" onClick={() => onAdd(menu)}>Add</button>
                                                        ) : (
                                                            <div className="flex items-center w-fit">
                                                                <button className="font-adlm text-sm w-8 h-8 p-2 aspect-square bg-gray-200 hover:bg-primary hover:text-white" onClick={() => onDecrease(menu)}>
                                                                    <FaMinus />
                                                                </button>
                                                                <p className="text-primary px-3">{menu.quantity}</p>
                                                                <button className="font-adlm text-sm w-8 h-8 p-2 aspect-square bg-gray-200 hover:bg-primary hover:text-white" onClick={() => onIncrease(menu)}>
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

                                {menuList.filter(menu => menu.isAdded).length > 0 && (
                                    <div className="md:hidden w-40 h-14 mx-auto fixed bottom-8 left-0 right-0 z-10">

                                        <div className="cursor-pointer w-full h-12 bg-primary rounded-full shadow-xl border-2 border-primary flex items-center justify-between p-2" onClick={()=>setCartModal(true)}>
                                            <div className="text-white bg-primary-dark/50 rounded-full w-9 h-9 flex justify-center items-center">
                                                <MdAddShoppingCart />
                                            </div>
                                            <div>
                                                <p className="font-adlm text-white block text-sm">View Cart</p>
                                                <p className="text-xs text-white/70">
                                                    {menuList.filter(menu => menu.isAdded).length && (() => {
                                                        let total = 0;
                                                        menuList.filter(menu => menu.isAdded)?.forEach(item => {
                                                            total += item.quantity;
                                                        });
                                                        total = Number(total.toFixed(2));
                                                        return ( 
                                                            <>
                                                                {total && (
                                                                    <span>{total}</span>
                                                                    
                                                                )}
                                                            </>
                                                        );
                                                    })()} items
                                                </p>
                                            </div>
                                            <p className="text-white text-xl">
                                                <FaChevronRight />
                                            </p>
                                        </div>
                                    </div>
                                )}
                           </div>
                        </div>

                        <Modal show={cartModal} size="md" position="center" onClose={() => setCartModal(false)}>
                            <ModalBody>
                                <div className="w-full flex justify-end">
                                    <button className="btn-icon px-2 text-xl" onClick={() => setCartModal(false)}>
                                        <IoClose />
                                    </button>
                                </div>
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-adlm text-primary flex items-center gap-2">
                                        <span> <MdAddShoppingCart /></span>
                                        Cart
                                    </h3>
                                    
                                   <div className="max-h-96 overflow-auto p-2">
                                        {menuList.filter(menu => menu.isAdded).map((item, ind) => (
                                            <div key={item.id} className={`flex items-center border-b p-2 pb-4 ${ind%2 == 0 ? 'bg-gray-50' : ''}`}>
                                                <div className="w-14 h-14 relative rounded-lg overflow-hidden mr-4">
                                                    {item.image ? (
                                                        <Image 
                                                            src={item.image} 
                                                            alt={item.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                            <span className="text-gray-600">
                                                                <IoImageOutline />
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="flex-1">
                                                    <h3 className="font-adlm text-gray-800">{item.name}</h3>
                                                    <p className="text-gray-600 text-sm">
                                                        {item.type && (
                                                                <span>{item.type} - </span>
                                                        )}
                                                        <span className="text-gray-600 text-sm font-adlm"> {item.category}</span>
                                                    </p>
                                                    
                                                    <div className="flex items-center mt-2">
                                                        <span className="flex items-center text-primary font-adlm">
                                                            <BiRupee /> {item.price}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center">
                                                    <button 
                                                        onClick={() => onDecrease(item)}
                                                        className="w-8 h-8 p-1 rounded-full bg-gray-100 flex items-center justify-center"
                                                    >
                                                        <FaMinus className="text-primary text-xs" />
                                                    </button>
                                                    
                                                    <span className="mx-3 font-adlm w-6 text-center">
                                                        {item.quantity}
                                                    </span>
                                                    
                                                    <button 
                                                        onClick={() => onIncrease(item)}
                                                        className="w-8 h-8 p-1 rounded-full bg-primary flex items-center justify-center"
                                                    >
                                                        <FaPlus className="text-white text-xs" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                   </div>

                                    <div className="bg-white rounded-lg shadow-md p-4">
                                        <h2 className="text-lg font-adlm mb-4 text-gray-800">Order Summary</h2>
                                        
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Subtotal</span>
                                                <span className="font-adlm flex items-center">
                                                    <BiRupee /> {subTotal}
                                                </span>
                                            </div>
                                            
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Discount</span>
                                                <div className="flex items-center">
                                                    <input 
                                                        type="number" 
                                                        value={discount}
                                                        min={0}
                                                        max={100}
                                                        onChange={(e) => setDiscount(Number(e.target.value))}
                                                        className="w-16 bg-gray-50 border border-gray-200 rounded text-sm p-1 focus:ring-primary focus:border-primary"
                                                    />
                                                    <span className="ml-1">%</span>
                                                </div>
                                            </div>
                                            
                                            <div className="border-t pt-3 mt-3">
                                                <div className="flex justify-between font-adlm">
                                                    <span className="text-gray-800 text-lg">Total</span>
                                                    <span className="text-primary text-xl flex items-center">
                                                        <BiRupee className="text-xl" /> {total}
                                                    </span>
                                                </div>
                                            </div>
                                        </div> 

                                        <div className="flex gap-2">
                                            <button onClick={() => setCartModal(false)}className="w-full btn-primary-text mt-6 text-center font-adlm">
                                                    Cancel
                                            </button>
                                            <button onClick={() => onGenerateBill()}className="w-full btn-primary mt-6 text-center font-adlm">
                                                    Save
                                            </button>
                                        </div>
                                    </div>

                                 </div>
                            </ModalBody>
                        </Modal>
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
                        <p className="text-primary font-acme text-center text-lg">Wait for a minute... <br/> <span className="text-base"> or check you internet connection and reload the page again.</span></p>
                    </div>
                )}
               

                <div className="bg-white shadow rounded w-[30%] h-full overflow-auto hidden md:flex flex-col relative">
                    
                    <div className="h-[8%] bg-primary p-4 bg-opacity-15 text-primary font-adlm flex justify-between items-center sticky top-0 z-10">
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
                                                <button className="font-adlm text-sm w-8 h-8 p-2 aspect-square bg-gray-200 hover:bg-primary hover:text-white rounded-full" onClick={() => onDecrease(cart)}>
                                                    <FaMinus />
                                                </button>
                                                <p className="text-primary px-3">{cart.quantity}</p>
                                                <button className="font-adlm text-sm w-8 h-8 p-2 aspect-square bg-gray-200 hover:bg-primary hover:text-white rounded-full" onClick={() => onIncrease(cart)}>
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
                                        <span className="font-adlm">%</span> <input type="number" defaultValue={discount} min={0} max={100} name="discount" onChange={(e) => setDiscount(Number(e.target.value))} className="bg-transparent rounded border-slate-200 text-grey font-adlm h-8 text-sm focus:ring-primary  focus:border-primary" />
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
                            <p className="text-secondary-dark font-acme">Wait for a while...</p>
                        </div>
                    )}

                </div>

                

            </section>

            <div className="print-container hidden print:flex flex-col items-center gap-2 print:w-full">
                <BillTemplate order={billOrder}></BillTemplate>
            </div>

            
        </>
    )
}

