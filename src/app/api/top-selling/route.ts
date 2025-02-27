import { TopSelling } from "@/app/common";
import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    const [rows] = await pool.query(
        'SELECT p.name, SUM(p.price * op.quantity) AS total_price,  SUM(op.quantity) as total_quantity FROM billing_hexa op JOIN menu_hexa p ON op.menu_id = p.id GROUP BY p.id ORDER BY total_quantity DESC LIMIT 10');
    const result = rows as TopSelling[];
    
    result.map(res => {return {...res, total_quantity : Number(res.total_quantity), total_price : Number(res.total_price)}} )

    return NextResponse.json(result)
}