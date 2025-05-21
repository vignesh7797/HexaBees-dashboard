import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const date = searchParams.get('date') || new Date().toISOString().slice(0, 10);
    
        if (!category) {
          return NextResponse.json({ error: 'Category is required' }, { status: 400 });
        }
    
        const [rows] = await pool.query(
          `
          SELECT 
            mh.name AS item,
            SUM(bh.quantity) AS totalQuantity,
            SUM(bh.quantity * bh.price) AS totalSales
          FROM billing_hexa bh
          JOIN menu_hexa mh ON bh.menu_id = mh.id
          JOIN order_hexa oh ON bh.order_id = oh.id
          WHERE mh.category = ? AND DATE(oh.date) = ?
          GROUP BY mh.name
          `,
          [category, date]
        );
    
        return NextResponse.json(rows);
      } catch (error) {
        console.error('API error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
      }
}