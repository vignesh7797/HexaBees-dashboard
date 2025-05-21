import { TopSelling } from "@/app/common";
import pool from "@/lib/db";
import { NextResponse } from "next/server";
import moment from "moment";

export async function GET(request: Request) {
    try {
        // Get query parameters from the request URL
        const { searchParams } = new URL(request.url);
        const period = searchParams.get('period');
        const date = searchParams.get('date');
        
        // Base query - join with order_hexa to get the date
        let query = `
            SELECT 
                p.id,
                p.code, 
                p.price,
                p.image,
                p.name, 
                p.category,
                p.type,
                SUM(p.price * op.quantity) AS total_price,  
                SUM(op.quantity) as total_quantity 
            FROM billing_hexa op 
            JOIN menu_hexa p ON op.menu_id = p.id
            JOIN order_hexa o ON op.order_id = o.id
        `;
        
        // Add WHERE clause based on filter parameters
        if (period === 'today') {
            // Filter for today's sales
            const today = moment().format('YYYY-MM-DD');
            query += `WHERE DATE(o.date) = '${today}' `;
        } else if (period === 'month' && date) {
            // Filter for specific month (format: YYYY-MM)
            query += `WHERE DATE_FORMAT(o.date, '%Y-%m') = '${date}' `;
        } else if (period === 'custom' && date) {
            // Filter for specific date (format: YYYY-MM-DD)
            query += `WHERE DATE(o.date) = '${date}' `;
        }
        
        // Complete the query with GROUP BY, ORDER BY, and LIMIT
        query += `
            GROUP BY p.id 
            ORDER BY total_quantity DESC 
            LIMIT 10
        `;
        
        // Execute the query
        const [rows] = await pool.query(query);
        const result = rows as TopSelling[];
        
        // Format the numeric values
        const formattedResult = result.map(res => ({
            ...res, 
            total_quantity: Number(res.total_quantity), 
            total_price: Number(res.total_price)
        }));

        return NextResponse.json(formattedResult);
    } catch (error) {
        console.error('Error in top-selling API:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}