"use client"

import { useEffect, useState } from "react";
import axios from 'axios';
import { Button, Modal, Table } from "flowbite-react";
import moment from "moment";
import { MdOutlineCurrencyRupee, MdOutlineReceiptLong } from "react-icons/md";
import { TbBrandHexo, TbHexagonLetterB } from 'react-icons/tb';
import { BiRupee } from 'react-icons/bi';
import { ImLeaf } from 'react-icons/im';
import { Bill } from "../common";
import BillTemplate from "../components/billTemplate";




export default function Home() {

    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState<Bill>();

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

    return (
        <>
            {orders && (
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
                                {orders.map((order) => (
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
                                                <a role="button" className="text-cyan-600 hover:underline">
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
                    <ul>
                        {orders.map((order, ind) => (
                            <li key={order.id + '' + ind} className="p-4">
                                <h2>Order #{order.id}</h2>
                                <p>Customer: {order.customer_name}</p>
                                <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                                <p>Total Amount: ${order.total_amount}</p>
                                <h3>Products:</h3>
                                <ul key={order.id}>
                                    {order.products.map((product: any) => (
                                        <li key={product.id} className="px-2">
                                            {product.name} - ${product.price} x {product.quantity}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
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
                </div>
            )}
        </>
    )
}