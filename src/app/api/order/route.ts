import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req:Request) {

    try{

        const requestBody = await req.json();

        const { customer_name, items, date } = requestBody;

        if ( !items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
              { message: 'Customer name and products are required' },
              { status: 400 }
            );
        }

        // // Calculate total amount
        let totalAmount = 0;

        for (const item of items) {
            if (!item.menu_id || !item.quantity || !item.price) {
                console.error('Validation failed: Missing fields in item', item);
                return NextResponse.json(
                    { message: 'Each product must have id, quantity, and price' },
                    { status: 400 }
                );
            }
            totalAmount += item.quantity * item.price;
        }

        // Start a database transaction
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try{
            //Insert to order Table
             const [orderResult] = await pool.query(`INSERT into order_hexa (date, customer_name, total_amount) VALUES (?,?,?)`, 
            [
                date,
                customer_name, 
                totalAmount,
            ]);

            const orderId = (orderResult as any).insertId;

            //Insert to Billing table
            for(const item of items){
                await pool.query(`INSERT into billing_hexa (order_id, menu_id, quantity, price) VALUES (?,?,?,?)`,
                [
                    orderId,
                    item.menu_id,
                    item.quantity,
                    item.price
                ])
            }

            // Commit the transaction
            await connection.commit();
            connection.release();


            return NextResponse.json(
                { message: 'Order created successfully', orderId},
                { status: 201 }
            );
           


        } catch (error) {
            // Rollback the transaction in case of error
                await connection.rollback();
                connection.release();
                throw error;
        } 

    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { message: 'Internal server error 123456' },
            { status: 500 }
        );
    }

}