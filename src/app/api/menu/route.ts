
import pool from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function GET(req:NextApiRequest, res:NextResponse) {

    const { searchParams } = new URL(req.url || '');
    const id = searchParams.get('id');

        try{
            if(id){
                const [rows] = await pool.query('SELECT * FROM menu_hexa WHERE id = ?', [id]);
                if ((rows as any).length === 0) {
                  return NextResponse.json({status:200,  message: 'Product not found' });
                }
                return NextResponse.json(rows);
            }else{
                const [rows] = await pool.query('SELECT * FROM menu_hexa');
                return NextResponse.json(rows);
            }
            
        }catch (error){
            console.log(error);
            return NextResponse.json({status: 500, message:'Internal Server Error'})
        }
}

export async function POST(req:NextApiRequest, res:NextApiResponse) {

            const {name, code, category, image, price} = req.body;

            await pool.query(
                'INSERT into menu_hexa (name, code, category, image, price) VALUES (?, ?, ?, ?, ?)', 
                [name, code, category, image, price]
            );
           
            res.status(201).json({ 
                message: 'Menu Item Added Successfully' 
            });

}

export async function PUT(req:NextApiRequest, res:NextApiResponse) {
            const {id, ...updateData} = req.body;
            await pool.query('UPDATE menu_hexa SET ? WHERE id = ?', [updateData, id] );
            res.status(200).json({ message: 'Item updated successfully' });
}

export async function DELETE(req:NextApiRequest, res:NextApiResponse) {

            const {menu_id} = req.query;
            await pool.query('DELETE FROM menu_hexa WHERE id = ?', [menu_id])
            res.status(200).json({ message: 'Item deleted successfully' });
}  
