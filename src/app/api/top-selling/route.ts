import pool from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function GET(req:NextApiRequest, res:NextApiResponse) {
    const [rows] = await pool.query(
        'SELECT p.name, SUM(op.quantity) as total_quantity FROM billing_hexa op JOIN menu_hexa p ON op.menu_id = p.id GROUP BY p.id ORDER BY total_quantity DESC LIMIT 10');
    res.status(200).json(rows);
}