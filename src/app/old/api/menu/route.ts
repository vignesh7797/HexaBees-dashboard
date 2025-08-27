
import pool from "@/app/old/lib/db";
import { QueryResult } from "mysql2";
import { NextRequest, NextResponse } from "next/server";
import { storage } from "../../../../../lib/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const config = {
    api: {
      bodyParser: false,
    },
  };
  

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
            return NextResponse.json({status: 500, message:'Internal Server Error', error:error})
        }
}

export async function POST(req:Request) {

    try{
        const formData = await req.formData();

        const name = formData.get("name");
        const price = formData.get("price");
        const category = formData.get("category");
        const image = formData.get("image") || '';
        const code = formData.get("code");
        const type = formData.get("type");
        const imageFile = formData.get("imageFile");

        if (!name || !code || !category || !price) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        let imageUrl = image;
        
        

        if (imageFile && imageFile instanceof File) {
            // Upload file to Firebase Storage

            const storageRef = ref(storage, `menu/${name}_${code}`);
            await uploadBytes(storageRef, imageFile);
            imageUrl = await getDownloadURL(storageRef);
        }

        // fallback to null or empty string if needed
        if (!imageUrl) {
            imageUrl = '';
        }


        const values = [name, code, type, category, imageUrl, price]

        const [rows] = await pool.query(
            'INSERT INTO menu_hexa ( `name`, `code`, `type`, `category`, `image`, `price`) VALUES  (?, ?, ?, ?, ?, ?)', 
            values
        );


        // get Updated row
        const [row] = await pool.query('SELECT * FROM menu_hexa WHERE id = ?', [rows['insertId']]);

        
        return NextResponse.json({status:200, message:'Menu Item Added Successfully', data:row});
    } catch (error){
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }

}

export async function PUT(req:Request) {
    try {
        const formData = await req.formData();

        const id = formData.get("id");
        const name = formData.get("name");
        const price = formData.get("price");
        const category = formData.get("category");
        const image = formData.get("image");
        const code = formData.get("code");
        const type = formData.get("type");
        const imageFile = formData.get("imageFile");

        if (!id || !name || !code || !category || !price) {
            return NextResponse.json({ error: "All fields are required"}, { status: 400 });
        }
        
        let imageUrl;

        if(imageFile != "null"){
            const file = imageFile as File;
            const storageRef = ref(storage, `menu/${name}_${code}`);

            if (file instanceof File) {
                await uploadBytes(storageRef, file);
            }
            imageUrl = imageFile ? await getDownloadURL(storageRef) : image;
        }


        const values = [name, code, type, category, imageUrl, price, id]

        const [result] = await pool.query('UPDATE menu_hexa SET name = ?, code = ?, type = ?, category = ?, image = ?, price = ? WHERE id = ?', values );
        
        if (result['affectedRows'] === 0) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }

        // get Updated row
        const [row] = await pool.query('SELECT * FROM menu_hexa WHERE id = ?', [id]);
      
        return NextResponse.json({ message: "Item updated successfully", data : row }, { status: 200 });

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
