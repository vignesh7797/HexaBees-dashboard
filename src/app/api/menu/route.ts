
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// path to JSON file in /public
const filePath = path.join(process.cwd(), "public/json/menu.json");

function readMenu() {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

function writeMenu(data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export async function GET() {
  const menu = readMenu();
  return NextResponse.json(menu);
}

export async function POST(request: Request){
  const newItem = await request.json();
  const menu = readMenu();
  const id = menu.length ? Math.max(...menu.map(m => m.id)) + 1 : 1;
  const item = {id, ...newItem};
  menu.push(item);
  return NextResponse.json({data:item, success:true, message:'Item added successfully'}, { status: 201 });
}

export async function PUT(request:Request) {
  const updatedItem = request.json();
  const menu = readMenu();
  const index = menu.findIndex(item => item.id == updatedItem.id);
  if(index == -1){
    return NextResponse.json({error: true, message: 'Item not found'}, {status:404});
  }

  menu[index] = updatedItem;
  writeMenu(menu);
  return NextResponse.json({success:true, message:'Item updated successfully'}, {status:201});
}


export async function DELETE(request:Request) {
  const {id} = request.json();
  let menu = readMenu();
  menu = menu.filter(item => item.id !== id);
  writeMenu(menu);
  return NextResponse.json({success:true, message:'Item deleted successfully'}, {status:201});
}