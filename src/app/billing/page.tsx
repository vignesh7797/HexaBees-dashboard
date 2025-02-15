'use client';
import Link from 'next/link';
import { useMenuContext } from '../context/menuContext';
import { HiHome } from 'react-icons/hi2';
import { Button, Dropdown, TextInput } from 'flowbite-react';
import { BiRupee } from 'react-icons/bi';
import { ImLeaf } from 'react-icons/im';
import { TbBrandHexo, TbHexagonLetterB, TbMail } from 'react-icons/tb';
import { PiInstagramLogoBold } from 'react-icons/pi';


export default function Home() {
  const { menus } = useMenuContext();

  var date = new Date();

  var formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  var formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div>
      <div className="no-print">
        <Link href={'/'} type="button" className="primary-btn-icon">
          <HiHome />
        </Link>
        <h1 className="text-center">Menu Details</h1>
        <ul>
          {menus.map((menu) => (
            <li key={menu.id}>
              {menu.name} - ${menu.price}
            </li>
          ))}
        </ul>

          <form>
          <Dropdown label="" dismissOnClick={false} renderTrigger={() => 
           <TextInput id="name" type="name" placeholder="Name" className="w-[200px]" />
          }>
            <Dropdown.Item>Dashboard</Dropdown.Item>
            <Dropdown.Item>Settings</Dropdown.Item>
            <Dropdown.Item>Earnings</Dropdown.Item>
            <Dropdown.Item>Sign out</Dropdown.Item>
          </Dropdown>
          </form>

        <Button
          color="light"
          className="ml-auto my-2"
          onClick={() => window.print()}
        >
          Print
        </Button>
      </div>

        {/* Print Template */}
      <div className="print-container nunito-regular text-slate-600">
        <p className="flex items-center justify-center text-lg">
          <TbBrandHexo /> <TbHexagonLetterB />
        </p>
        <h1 className="text-center font-bold text-xl">Hexa Bees Ent.</h1>
        <h6 className="text-center font-semibold text-sm my-1">
          +91 904 212 7018
        </h6>
        <p className="text-center text-xs my-1">Bill Id: 234567</p>

        <div className="flex justify-between items-center p-2 border-dashed border-b-[2px] border-slate-400">
          <p className="text-sm">Date: {formattedDate}</p>
          <p className="text-sm">Time:{formattedTime}</p>
        </div>

        <table className="w-full p-2 border-b-[1px] border-dashed border-slate-400">
          <thead className="border-b-[1px] border-dashed border-slate-400 text-xs">
            <tr className="h-[30px]">
              <th>Item</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {menus.map((menu) => (
              <tr key={menu.id}>
                <td className="h-[30px]">
                  <p className="truncate w-[120px]">{menu.name}</p>
                </td>
                <td className="text-center">{menu.price}</td>
                <td className="text-center">1</td>
                <td className="text-center">{menu.price}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex flex-col items-end p-4 gap-2 border-b-2 border-dashed border-slate-400">
          <p className="text-sm">Discount : 0</p>
          <p className="text-sm">SubTotal : 0</p>
        </div>

        <p className="font-bold flex items-center justify-end p-4">
          Total : <BiRupee /> 2500
        </p>

        <div className="border-y-[1px] border-dashed border-slate-400 py-4">
          <div className="flex items-center justify-center gap-2 text-slate-400 text-ms font-bold  h-[50px]">
            Save Paper!! Save Nature!! <ImLeaf />
          </div>
        </div>
      </div>
    </div>
  );
}
