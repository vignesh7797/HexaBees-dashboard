import { Bill } from "@/app/common";
import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try{
        // Fetch all orders
        const [orders] = await pool.query(`
            SELECT 
            id,
            customer_name,
            date,
            sub_total,
            discount,
            total_amount
            FROM order_hexa
            ORDER BY date DESC
        `);

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

        return NextResponse.json(orderHistory);
    } catch (error) {
        console.error('Error fetching order history:', error);
        return NextResponse.json(
          { message: 'Internal server error' },
          { status: 500 }
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