
import pool from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    switch (req.method) {
        case 'GET':
            const [rows] = await pool.query('SELECT * FROM menu_hexa');
            res.status(200).json(rows);
            break;

        case 'POST':
            const {name, code, category, image, price} = req.body;
            await pool.query('INSERT into menu_hexa (name, code, category, image, price) VALUES (?, ?, ?, ?, ?)', [name, code, category, image, price]);
            res.status(201).json({ message: 'Menu Item Added Successfully' });
            break;

        case 'PUT':
            const {id, ...updateData} = req.body;
            await pool.query('UPDATE menu_hexa SET ? WHERE id = ?', [updateData, id] );
            res.status(200).json({ message: 'Item updated successfully' });
            break;

        case 'DELETE':
            const {menu_id} = req.query;
            await pool.query('DELETE FROM menu_hexa WHERE id = ?', [menu_id])
            res.status(200).json({ message: 'Item deleted successfully' });
            break;
    
        default:
            res.status(405).json({ message: 'Method not allowed' });
            break;
    }
}