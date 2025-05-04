import pool from "@/lib/db";
import { NextResponse } from "next/server";

const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

export async function GET() {
    try {

        const todayDate = getTodayDate();

        const [totalData] = await pool.query(
            `SELECT SUM(total_amount) AS totalRevenue, COUNT(*) AS totalOrders FROM order_hexa`
        );


        const [todayData] = await pool.query(
            `SELECT SUM(total_amount) AS todaysRevenue, 
                COUNT(*) AS todaysOrders 
                FROM order_hexa 
                WHERE DATE(date) = ?`,
            [todayDate]
        );

        const targetDate = new Date('2025-03-02');
        const today = new Date();
        const diffInMs =  today.getTime() - targetDate.getTime();
        // Convert ms to days
        const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

        const response = {
            totalRevenue: totalData[0].totalRevenue || 0,
            totalOrders: totalData[0].totalOrders || 0,
            todaysRevenue: todayData[0].todaysRevenue || 0,
            todaysOrders: todayData[0].todaysOrders || 0,
            averageRevenue : (totalData[0].totalRevenue / diffInDays).toFixed(2) 
        };
      
        return NextResponse.json(response);
        
    } catch {
        return NextResponse.error();
    }
}