import { Bill } from "@/app/common";
import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req : Request) {
    try{
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const offset = (page - 1) * limit;

        // Validation for page and limit
        if (isNaN(page) || page < 1) {
            return NextResponse.json(
            { message: 'Invalid page number. Page number must be greater than 0.' },
            { status: 400 }
            );
        }
    
        if (isNaN(limit) || limit < 1) {
            return NextResponse.json(
            { message: 'Invalid limit. Limit must be greater than 0.' },
            { status: 400 }
            );
        }

        // Get total count of orders
        const [totalResult] = await pool.query(`SELECT COUNT(*) as total FROM order_hexa`);
        const totalItems = totalResult[0].total;
        const totalPages = Math.ceil(totalItems / limit);

        // Fetch all orders
        const [orders] = await pool.query(`
            SELECT 
            id,
            CONVERT_TZ(date, '+00:00', '+00:00') AS date,
            customer_name,
            sub_total,
            discount,
            total_amount
            FROM order_hexa
            ORDER BY date DESC
            LIMIT ? OFFSET ?
        `, [limit, offset]);

        const orderResult = orders as Bill[]

        // Fetch products for each order
        const orderHistory = await Promise.all(
            orderResult.map(async (order: Bill) => {
                const [products] = await pool.query(
                    `
                    SELECT 
                    op.menu_id,
                    p.name,
                    op.quantity,
                    op.price
                    FROM billing_hexa op
                    JOIN menu_hexa p ON op.menu_id = p.id
                    WHERE op.order_id = ?
                    `,
                    [order.id]
                );

                return {
                    ...order,
                    products,
                };
            })
        );

        return NextResponse.json({
            data : orderHistory,
            totalItems : totalItems,
            totalPages : totalPages,
            currentPage : page,
            limit : limit,
            message : orderHistory && orderHistory.length == 0 ? 'Data not found..! Please choose some other page.' : ''
        });
    } catch (error) {
        console.error('Error fetching order history:', error);
        return NextResponse.json(
          { message: 'Internal server error', error : error},
          { status: 500 },
        )
    }
}

export async function DELETE(req:NextRequest) {
    try {
        const {id} = await req.json();
        
        await pool.query(`DELETE FROM billing_hexa WHERE order_id = ?`, [id]);

        const [result] = await pool.query(`DELETE FROM order_hexa WHERE id = ?`, [id]);

        if (result['affectedRows'] === 0) {
            await pool.rollback();
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({status : 200, message : 'Items Deleted Successfully'})
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}