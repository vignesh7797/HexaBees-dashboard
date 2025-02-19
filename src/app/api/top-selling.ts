import pool from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    switch (req.method) {
        case 'GET':
            const [rows] = await pool.query(
                'SELECT p.name, SUM(op.quantity) as total_quantity FROM billing_hexa op JOIN menu_hexa p ON op.menu_id = p.id GROUP BY p.id ORDER BY total_quantity DESC LIMIT 10');
            res.status(200).json(rows);
            break;
    
        default:
            break;
    }
}