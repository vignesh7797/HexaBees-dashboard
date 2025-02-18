import connection from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const [rows] = await connection.query('SELECT * FROM menu_hexa');
        return NextResponse.json({status:200, rows});
    } catch (error:any) {
        console.error(error)
        return NextResponse.json({status:500, error:error.message});
    }
}

export async function POST() {
    return NextResponse.json({ message: 'POST method not implemented' }, { status: 405 });
}