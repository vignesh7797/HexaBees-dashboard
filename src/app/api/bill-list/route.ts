import pool from "@/lib/db";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest) {
    const {page = 1, limit = 10} = req.query;

    const offset = (Number(page) -1 * Number(limit));

    try{
        const [rows] = await pool.query(`
            SELECT op.id, op.order_id, op.menu_id, op.quantity, op.price, p.name, o.date, o.customer_name
            FROM billing_hexa op
            JOIN menu_hexa p ON op.menu_id = p.id
            JOIN \`order_hexa\` o ON op.order_id = o.id
            LIMIT ?
            OFFSET ?
        `, [Number(limit), offset])

        // Fetch total count of order_product records
        const [totalCount] = await pool.query('SELECT COUNT(*) as total FROM billing');
        const total = (totalCount as any)[0].total;

        // res.status(200).json({
        //     data: rows,
        //     total,
        //     page: Number(page),
        //     limit: Number(limit),
        // });
        return NextResponse.json({
            data: rows,
            total,
            page: Number(page),
            limit: Number(limit),
        })

    } catch (error) {
        console.error(error);
        // res.status(500).json({ message: 'Internal server error' });

        return NextResponse.error();
    }
}