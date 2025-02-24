"use client"

import { useEffect, useState } from "react";
import axios from 'axios';
import { Button, Modal, Table, TextInput } from "flowbite-react";
import moment from "moment";
import { MdOutlineCurrencyRupee, MdOutlineReceiptLong } from "react-icons/md";
import { Bill, Menu, Order } from "../common";
import BillTemplate from "../components/billTemplate";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { HiMinus, HiOutlineSearch, HiPlus } from "react-icons/hi";
import { useMenuContext } from "../context/menuContext";
import { FaUser } from "react-icons/fa6";



export default function Home() {

    const { menus } = useMenuContext();

    const [orders, setOrders] = useState<Bill[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState<Bill>();
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editData, setEditData] = useState<Bill | null>();
    const [search, setSearch] = useState('');
    const [filteredMenu, setFIlteredMenu] = useState<Menu[]>([]);

    useEffect(() => {
        fetchHistory()
    }, [])

    const fetchHistory = async () => {
        try {
            const { data } = await axios.get('/api/history');

            setOrders(data);

        } catch (error) {
            console.error('Error fetching order history:', error);
            setError('Failed to fetch order history');
        } finally {
            setLoading(false);
        }
    }

    const formatDate = (date: Date) => {
        return moment(date).format("DD MMM YYYY hh:mm A");
    }

    const onDecrease = (prod:any) =>{

        setEditData((prevData:any) => {
            // Find the index of the product to update
            const productIndex = prevData.products.findIndex((product:any) => product.menu_id == prod.menu_id);
      
            if (productIndex == -1) {
              console.error('Product not found');
              return prevData; // Return the previous state if the product is not found
            }
      
            // Create a new array with the updated product
            const updatedProducts = prevData.products.map((product:any, index:number) =>
              index === productIndex ? { ...product, quantity: prod.quantity - 1 } : product
            ).filter((prd:any) => prd.quantity > 0);
      
            // Return the new state with the updated products array
            return {
              ...prevData,
              products: updatedProducts
            };
          });
    }

    const onIncrease = (prod:any) =>{

        setEditData((prevData:any) => {
            // Find the index of the product to update
            const productIndex = prevData.products.findIndex((product:any) => product.menu_id == prod.menu_id);
      
            if (productIndex == -1) {
              console.error('Product not found');
              return prevData; // Return the previous state if the product is not found
            }
      
            // Create a new array with the updated product
            const updatedProducts = prevData.products.map((product:any, index:number) =>
              index === productIndex ? { ...product, quantity: prod.quantity + 1 } : product
            );
      
            // Return the new state with the updated products array
            return {
              ...prevData,
              products: updatedProducts
            };
          });

    }

    const onSearchHandle = (event:any) =>{
        setSearch(event.target.value);
        setFIlteredMenu(menus.filter(menu => menu.name.toLowerCase().includes(event.target.value.trim().toLowerCase())))
    }

    const onAdd = (menu:Menu) =>{
        setEditData((prevData:any) => {
            const prodIndex = prevData.products.findIndex((prod:any) => prod.menu_id == menu.id);
            
            let newItem:any = {
                menu_id : menu.id,
                name : menu.name,
                quantity : 1,
                price : menu.price
            } 

            const updateProds = [...prevData.products, newItem]

            return {
                ...prevData,
                products : updateProds
            }
        })
    }

    useEffect(() =>{
        setFIlteredMenu(menus);
      },[menus])

    return (
        <>
        {loading && (
            <div className="w-[700px] mx-auto my-auto">
                <DotLottieReact
                    src={'https://lottie.host/ee3031d5-56a0-40e2-88a7-764d7faaced8/Jv4V3rL1ix.lottie'}
                    loop
                    autoplay
                    speed={0.5}
                />
            </div>
        )}
            {!loading && orders && (
                <div className="no-print">
                    <h1 className="text-2xl font-bold text-center">Order History</h1>
                    <div className="p-8">
                        <Table>
                            <Table.Head>
                                <Table.HeadCell className="text-center"></Table.HeadCell>
                                <Table.HeadCell className="text-center">Id</Table.HeadCell>
                                <Table.HeadCell className="text-center">Data / Time</Table.HeadCell>
                                <Table.HeadCell className="text-center">Amount</Table.HeadCell>
                                <Table.HeadCell className="text-center">Action</Table.HeadCell>
                            </Table.Head>
                            <Table.Body>
                                {orders.map((order:any, ind) => (
                                    <Table.Row key={order.id}>
                                        <Table.Cell className="text-center">
                                            <a role="button" className="text-cyan-600" onClick={() => { setOpenModal(true), setModalData(order) }}>
                                                <MdOutlineReceiptLong className="text-xl" />
                                            </a>
                                        </Table.Cell>
                                        <Table.Cell className="text-center">#{order.id}</Table.Cell>
                                        <Table.Cell className="text-center">{formatDate(order.date)}</Table.Cell>
                                        <Table.Cell className="text-center">
                                            <span className="flex items-center justify-center"> <MdOutlineCurrencyRupee /> {order.total_amount}</span>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className="flex items-center justify-center gap-6">
                                                <a role="button" className="text-cyan-600 hover:underline" onClick={()=>{setOpenEditModal(true), setEditData(order)}}>
                                                    Edit
                                                </a>
                                                <a role="button" className="text-red-400 hover:underline">
                                                    Delete
                                                </a>
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </div>

                    <Modal show={openModal} size='md' className="no-print" onClose={() => setOpenModal(false)}>
                        <Modal.Header>Bill Data</Modal.Header>
                        <Modal.Body>
                            {modalData && (
                                <BillTemplate order={modalData}/>
                            )}
                        </Modal.Body>
                        <Modal.Footer className="justify-end">
                            <Button onClick={() => {setOpenModal(false), window.print()}}>Print</Button>
                            <Button color="gray" className="mr-auto" onClick={() => setOpenModal(false)}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={openEditModal} size="7xl" className="no-print" onClose={()=>setOpenEditModal(false)}>
                        <Modal.Header>Edit Bill Data</Modal.Header>
                        <Modal.Body>
                            <div className="flex items-start">
                                {editData && editData.products && (
                                    <div className="px-6 pb-6 w-full">
                                        <table className="w-full">
                                            <tbody>
                                                {editData.products
                                                .filter(prd => Number(prd.quantity) > 0)
                                                .map((prod:any, ind) => 
                                                ( 
                                                    <tr key={prod.menu_id} className="h-10">  
                                                        
                                                        <th className="text-left w-1/2">{prod.name}</th>
                                                        <td>
                                                            <div className="flex items-center">
                                                                <Button size='xs' className='rounded-none rounded-l-md' onClick={()=> onDecrease(prod)}>
                                                                    <HiMinus className="h-4 w-4"/>
                                                                </Button>
                                                                    <p className='font-normal px-2'>{prod.quantity}</p>
                                                                <Button size='xs' className='rounded-none rounded-r-md' onClick={()=>onIncrease(prod)}>
                                                                    <HiPlus className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    
                                                ))}
                                            </tbody>
                                        </table>
                                </div>
                                )}

                                <div className="w-full">
                                    <div className="my-4 w-full mx-auto relative">
                                        <h5 className="text-xl text-center mb-4 font-bold leading-none text-gray-900 dark:text-white">Tibet Menu</h5>
                                        <TextInput id="search" type="text" className='w-full md:w-80 mx-auto' icon={HiOutlineSearch} value={search} onChange={onSearchHandle} placeholder="Search Menu" autoFocus sizing='sm' />
                                    </div>
                                    <div className="flow-root h-60 overflow-auto">
                                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {filteredMenu && editData && filteredMenu
                                            .filter(menu => editData?.products?.findIndex((prd:any) => prd.menu_id == menu.id) == -1)
                                            .map((list:Menu) => {
                                            return (
                                                <li className="py-3 sm:py-4" key={list.id}>
                                                <div className="flex items-center space-x-4">
                                                    <div className="shrink-0">
                                                    {list.image ? (
                                                    <img
                                                    alt={list.name}
                                                    src={list.image || ''}
                                                    className="rounded-full h-10 w-10"
                                                    />
                                                    ) : (
                                                    <div className='w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500'>
                                                        <FaUser />
                                                    </div>
                                                    )}
                                                    </div>
                                                    <div className="min-w-0 w-60">
                                                    <p className="truncate text-gray-900 dark:text-white font-bold text-base">{list.name}</p>
                                                    </div>
                                                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white flex-auto">{list.price}</div>
                                                    
                                                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                                
                                                    <Button size='xs'  onClick={() =>onAdd(list)}>Add</Button> 
                            
                                                    </div>
                                                </div>
                                                </li>
                                            )
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer className="justify-end">
                            <Button onClick={() => {setOpenModal(false), window.print()}}>Print</Button>
                            <Button color="gray" className="mr-auto" onClick={() => setOpenModal(false)}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            )}
        </>
    )
}