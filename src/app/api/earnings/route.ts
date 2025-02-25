import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface DateList {
    date:Date | string,
    total : number
}

export async function GET(req:NextRequest) {
    const searchParams = req.nextUrl.searchParams;

    const range = searchParams.get('range') || '';

    if (!range || typeof range != 'string') {
        return NextResponse.json({message: 'Invalid time range'})
    }

    let interval = '';
    let dateFormat = '';

    switch (range) {
        case 'year':
            interval = 'INTERVAL 12 MONTh';
            dateFormat = '%Y-%m';
            break;
        
        case 'month':
            interval = 'INTERVAL 1 MONTH';
            dateFormat = '%y-%m-%d';
            break;
        
        case 'week':
            interval = 'INTERVAL 1 WEEK';
            dateFormat = '%Y-%m-%d';
            break;

        case 'day':
            interval = 'INTERVAL 1 DAY';
            dateFormat = '%y-%m-%d %H:00';
            break;
    
        default:
            return NextResponse.error();
    }

    try{
        const [rows] = await pool.query(`SELECT DATE_FORMAT(date, ?) as date, SUM(total_amount) as total FROM \`order_hexa\` WHERE date >= NOW() - ${interval} GROUP BY date ORDER BY date ASC`, [dateFormat]);
        const response = rows as DateList[]
        const labels = response.map((row: DateList) => row.date);
        const data = response.map((row: DateList) => row.total);

        return NextResponse.json({status:200, labels, data });
    } catch (error) {
        console.error(error);
        return NextResponse.json({status:500, message: 'Internal server error' });
    }
}

// Handle POST requests
export async function POST() {
    return NextResponse.json({ message: 'Hello from POST' });
  }