"use client"

import { useEffect, useState } from "react";
import axios from 'axios';
import { Alert, Button, Card, Modal, Popover, Table, TextInput } from "flowbite-react";
import moment from "moment";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { Bill, Menu } from "../common";
import BillTemplate from "../components/billTemplate";
import { HiMinus, HiOutlineExclamationCircle, HiOutlineSearch, HiPlus } from "react-icons/hi";
import { useMenuContext } from "../context/menuContext";
import { FaUser } from "react-icons/fa6";
import Image from "next/image";
import { HiInformationCircle, HiDotsVertical } from "react-icons/hi";
import Pagination from "../components/pagination";



export default function Home() {

    const { menus } = useMenuContext();

    const [orders, setOrders] = useState<Bill[]>([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState<Bill>();
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editData, setEditData] = useState<Bill>();
    const [search, setSearch] = useState('');
    const [filteredMenu, setFIlteredMenu] = useState<Menu[]>([]);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState<Bill | null>(null);

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0)
    const [limit, setLimit] = useState(10);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if(orders && orders.length == 0)fetchHistory()
    })

    const fetchHistory = async (page = currentPage, pageLimit = limit) => {
        setLoading(true);
        setMessage('');
        try {
            const { data } = await axios.get(`/api/history?page=${page}&limit=${pageLimit}`);
            
            if(data.data && data.data.length > 0){
                setOrders(data.data);
                setCurrentPage(data.currentPage);
                setTotalItems(data.totalItems)
            } else {
                setMessage(data.message)
            }
            

        } catch (error) {
            const { response } = error
            console.error('Error fetching order history:', error);
            setMessage(response.data.message)
        } finally {
            setLoading(false);
        }
    }

    const formatDate = (date: Date | string) => {
        return moment(new Date(date)).format("DD MMM YYYY hh:mm A");
    }

    const onDecrease = (prod:Menu) =>{

        setEditData((prevData:Bill) => {

            // Find the index of the product to update
            const productIndex = prevData.products.findIndex((product) => product.menu_id == prod.menu_id);
      
            if (productIndex == -1) {
              console.error('Product not found');
              return prevData; // Return the previous state if the product is not found
            }
      
            // Create a new array with the updated product
            const updatedProducts = prevData.products.map((product:Menu, index:number) =>
              index === productIndex ? { ...product, quantity: Number(prod.quantity) - 1 } : product
            ).filter((prd:Menu) => Number(prd.quantity) > 0);
      
            // Return the new state with the updated products array
            return {
              ...prevData,
              products: updatedProducts
            };
          });
    }

    const onIncrease = (prod:Menu) =>{

        setEditData((prevData:Bill) => {
            // Find the index of the product to update
            const productIndex = prevData.products.findIndex((product:Menu) => product.menu_id == prod.menu_id);
      
            if (productIndex == -1) {
              console.error('Product not found');
              return prevData; // Return the previous state if the product is not found
            }
      
            // Create a new array with the updated product
            const updatedProducts = prevData.products.map((product:Menu, index:number) =>
              index === productIndex ? { ...product, quantity: Number(prod.quantity) + 1 } : product
            );
      
            // Return the new state with the updated products array
            return {
              ...prevData,
              products: updatedProducts
            };
          });

    }

    const onSearchHandle = (event:React.ChangeEvent<HTMLInputElement>) =>{
        setSearch(event.target.value);
        setFIlteredMenu(menus.filter(menu => menu.name.toLowerCase().includes(event.target.value.trim().toLowerCase())))
    }

    const onAdd = (menu:Menu) =>{
        setEditData((prevData:Bill) => {

            const newItem:Menu = {
                menu_id: menu.id,
                name: menu.name,
                type: menu.type,
                quantity: 1,
                price: menu.price,
                id: 0,
                category: menu.category,
                code: menu.code
            } 

            const updateProds = [...prevData.products, newItem]

            return {
                ...prevData,
                products : updateProds
            }
        })
    }

    const onDeleteMenu = (bill: Bill) =>{
        setOpenConfirmModal(true);
        setSelectedMenu(bill)
    }
    
    const onConfirm = async() =>{
        setOpenConfirmModal(false);
        const response = await fetch('/api/history', {
            method : 'DELETE',
            body : JSON.stringify({id:selectedMenu.id})
        })

        const data = await response.json();

        if(response.ok){
            setOrders(list =>list.filter(item => item.id !== selectedMenu.id));
        }else{
            throw new Error(data.error || "Something went wrong");
        }
    }

    useEffect(() =>{
        setFIlteredMenu(menus);
      },[menus])

    const onPageChange = (event) => {
        setCurrentPage(event.page);
        setLimit(event.count)
        fetchHistory(event.page, event.count);
    };



    return (
        <>

        {orders && (
            <div className="no-print p-1 md:p-4">
                <Card className="h-auto max-h-[88vh] overflow-auto">
                    <Table>
                        <Table.Head>
                            <Table.HeadCell className="text-center font-adlm text-orange-500 bg-orange-50 w-10">No.</Table.HeadCell>
                            <Table.HeadCell className="text-center font-adlm text-orange-500 bg-orange-50">id</Table.HeadCell>
                            <Table.HeadCell className="text-center font-adlm text-orange-500 bg-orange-50">Date</Table.HeadCell>
                            <Table.HeadCell className="text-center font-adlm text-orange-500 bg-orange-50">Amount</Table.HeadCell>
                            <Table.HeadCell className="text-center font-adlm text-orange-500 bg-orange-50">Action</Table.HeadCell>
                        </Table.Head>

                        <Table.Body>
                            { !loading && orders.map((order, ind) => (
                                <Table.Row key={order.id} className="hover:bg-gray-100 cursor-pointer" >
                                    <Table.Cell className="text-center text-sm font-adlm text-zinc-600 p-2">{(currentPage - 1) * limit + ind + 1}</Table.Cell>
                                    <Table.Cell className="text-center text-sm font-adlm text-zinc-600 p-2" onClick={() => {setOpenModal(true); setModalData(order)}}>
                                        <a role="link" className="underline text-orange-500">
                                            #{order.id}
                                        </a>
                                    </Table.Cell>
                                    <Table.Cell className="text-center text-sm font-adlm text-black p-2">{formatDate(order.date)}</Table.Cell>
                                    <Table.Cell className="text-center text-sm font-adlm text-black p-2"> 
                                        <span className="flex items-center justify-center"><MdOutlineCurrencyRupee />{order.total_amount}</span>
                                    </Table.Cell>
                                    <Table.Cell className="p-2 flex items-center justify-center gap-2">
                                        <Popover
                                            aria-labelledby="profile-popover"
                                            content={
                                                <div className="w-28">
                                                    <ul className="w-full">
                                                        <li className="w-full">
                                                            <a role="button" className="block font-adlm py-2 px-4 w-full hover:bg-orange-50 hover:text-orange-500" onClick={()=>{setOpenModal(true); setModalData(order)}}>View Bill</a>
                                                        </li>

                                                        <li className="w-full">
                                                            <a role="button" className="block font-adlm py-2 px-4 w-full hover:bg-orange-50 hover:text-orange-500" onClick={()=>{setOpenEditModal(true); setEditData(order)}}>Edit</a>
                                                        </li>

                                                        <li className="w-full">
                                                            <a role="button" className="block font-adlm py-2 px-4 w-full hover:bg-orange-50 hover:text-orange-500" onClick={() =>{onDeleteMenu(order)}}>Delete</a>
                                                        </li>
                                                    </ul>
                                                </div>
                                                }
                                            >
                                            <button className="btn-icon"><HiDotsVertical className="text-xl"/></button>
                                        </Popover>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                            {loading && (
                                <Table.Row>
                                    <Table.Cell colSpan={6}>
                                        <div className="h-[60vh] flex justify-center items-center">
                                           <div className="dot-loading">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                           </div>
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    
                    </Table>

                   <Pagination total={totalItems} count={limit} currentPage={currentPage} onPageChange={onPageChange}></Pagination>
                </Card>


                <Modal show={openModal} size='md' className="no-print" onClose={() => setOpenModal(false)}>
                    <Modal.Body>
                        {modalData && (
                            <BillTemplate order={modalData}/>
                        )}
                    </Modal.Body>
                    <Modal.Footer className="justify-end">
                        <button className="btn-primary" onClick={() => {setOpenModal(false); window.print()}}>Print</button>
                        <button className="btn-light mr-auto" onClick={() => setOpenModal(false)}>
                            Close
                        </button>
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
                                            .map((prod:Menu) => 
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
                                        .filter(menu => editData?.products?.findIndex((prd) => prd.menu_id == menu.id) == -1)
                                        .map((list:Menu) => {
                                        return (
                                            <li className="py-3 sm:py-4" key={list.id}>
                                            <div className="flex items-center space-x-4">
                                                <div className="shrink-0">
                                                {list.image ? (
                                                    <Image alt={list.name} src={list.image} className="rounded-full h-10 w-10"
                                                        width={40} height={40} unoptimized
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
                        <Button onClick={() => {setOpenModal(false); window.print()}}>Print</Button>
                        <Button color="gray" className="mr-auto" onClick={() => setOpenModal(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                    {/* Confirm Model */}
                <Modal show={openConfirmModal} size="md" onClose={() => setOpenConfirmModal(false)} popup>
                    <Modal.Header />
                    <Modal.Body>
                        <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this Menu?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={onConfirm}>
                            {"Yes, I'm sure"}
                            </Button>
                            <Button color="gray" onClick={() => setOpenConfirmModal(false)}>
                            No, cancel
                            </Button>
                        </div>
                        </div>
                    </Modal.Body>
                </Modal>

            </div>
        )}

        <div className="hidden print:block">
            <BillTemplate order={modalData}/>
        </div>

        {message && (
            <Alert color="failure" onDismiss={() => setMessage('')} icon={HiInformationCircle} className="absolute top-20 right-0 z-[999]">
                <span className="font-medium">Error alert!</span> {message}
            </Alert>
        )}
        </>
    )
}