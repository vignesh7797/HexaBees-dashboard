import pool from "@/app/old/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try{
        const [rows] = await pool.query(`SELECT AUTO_INCREMENT FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'order_hexa' `);

        const lastId = rows[0].AUTO_INCREMENT;
        return NextResponse.json({lastId : lastId})
    } catch (error){
        console.log(error)
        return NextResponse.error();
    }
}