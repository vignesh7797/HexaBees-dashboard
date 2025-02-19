import pool from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    const {range} = req.query;

    if (!range || typeof range !== 'string') {
        return res.status(400).json({ message: 'Invalid time range' });
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
            return res.status(400).json({ message: 'Invalid time range' });
    }

    try{
        const [rows]:any = await pool.query(`SELECT DATE_FORMAT(date, ?) as date, SUM(total_amount) as total FROM \`order_hexa\` WHERE date >= NOW() - ${interval} GROUP BY date ORDER BY date ASC`, [dateFormat]);

        const labels = rows.map((row: any) => row.date);
        const data = rows.map((row: any) => row.total);

    res.status(200).json({ labels, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}