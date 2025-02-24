import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:Request) {
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

        // Fetch products for each order
        const orderHistory = await Promise.all(
            (orders as any).map(async (order: any) => {
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

export async function PUT(req:NextRequest) {
    
}