
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

            const { searchParams } = new URL(req.url || '');
            const name = searchParams.get('name');
            const code = searchParams.get('code');
            const category = searchParams.get('category');
            const image = searchParams.get('image');
            const price = searchParams.get('price');


            await pool.query(
                'INSERT into menu_hexa (name, code, category, image, price) VALUES (?, ?, ?, ?, ?)', 
                [name, code, category, image, price]
            );
           
            return NextResponse.json({status:200, message:'Menu Item Added Successfully'});

}

export async function PUT(req:NextRequest) {
            const body = await req.json();
            const {id, ...updateData} = body;
            await pool.query('UPDATE menu_hexa SET ? WHERE id = ?', [updateData, id] );
            return NextResponse.json({status : 200, message : 'Items Updated Successfully'})
}

export async function DELETE(req:NextRequest) {
            const { searchParams } = new URL(req.url || '');
            const menu_id = searchParams.get('menu_id');

            await pool.query('DELETE FROM menu_hexa WHERE id = ?', [menu_id])
            return NextResponse.json({status : 200, message : 'Items Deleted Successfully'})

}  
