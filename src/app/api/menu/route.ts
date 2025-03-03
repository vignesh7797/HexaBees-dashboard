
import pool from "@/lib/db";
import { QueryResult } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {

    const { searchParams } = new URL(req.url || '');
    const id = searchParams.get('id');

        try{
            if(id){
                const [rows] = await pool.query('SELECT * FROM menu_hexa WHERE id = ?', [id]);
                const result = rows as QueryResult[]
                if (result.length === 0) {
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

export async function POST(req:NextRequest) {

    try{
        const { name, code, type, category, image, price } = await req.json();

        if (!name || !code || !category || !price) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const values = [name, code, type, category, image, price]

        const [rows] = await pool.query(
            'INSERT INTO menu_hexa ( `name`, `code`, `type`, `category`, `image`, `price`) VALUES  (?, ?, ?, ?, ?, ?)', 
            values
        );

        console.log(rows)
        
        return NextResponse.json({status:200, message:'Menu Item Added Successfully', data:rows});
    } catch (error){
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }

}

export async function PUT(req:NextRequest) {
    try {
        const { id, name, code, type, category, image, price } = await req.json();
            
        if (!id || !name || !code || !category || !price) {
            return NextResponse.json({ error: "All fields are required"}, { status: 400 });
        }

        const [result] = await pool.query('UPDATE menu_hexa SET name = ?, code = ?, type = ?, category = ?, image = ?, price = ? WHERE id = ?', [name, code, type, category, image, price, id] );
        
        if (result['affectedRows'] === 0) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
          }
      
          return NextResponse.json({ message: "Item updated successfully" }, { status: 200 });

    } catch (error) {
         return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
            
}

export async function DELETE(req:NextRequest) {
    try {
        const { id } = await req.json()

        await pool.query('DELETE FROM menu_hexa WHERE id = ?', [id])

        return NextResponse.json({status : 200, message : 'Items Deleted Successfully'})
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }

}  
