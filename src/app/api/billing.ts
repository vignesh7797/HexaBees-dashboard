import pool from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    switch (req.method) {
        case 'POST':
            const {customer_name, items} = req.body;

            //Insert to order Table
            const [orderResult] = await pool.query('INSERT into `order_hexa (customer_name, total_amount) VALUES (?,?)', 
            [
                customer_name, 
                items.reduce((sum: number, p: any) => sum + p.price * p.quantity, 0),
            ]);

            const orderId = (orderResult as any).insertId;

            //Insert to Billing table
            for(const item of items){
                await pool.query('INSERT into billing_hexa (order_id, menu_id, quantity, price) VALUES (?,?,?,?)',
                [
                    item.order_id,
                    item.menu_id,
                    item.quantity,
                    item.price
                ])
                res.status(201).json({ message: 'Order created successfully', orderId });
            }
            break;
    
        default:
            res.status(405).json({ message: 'Method not allowed' });
            break;
    }
}