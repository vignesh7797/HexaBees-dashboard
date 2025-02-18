'use client';

import { FC, useState } from "react";
import { TbHexagonLetterBFilled, TbHexagonLetterH } from "react-icons/tb";
import Link from "next/link";
import { Button, Drawer, Sidebar } from "flowbite-react";
import { MdOutlineRestaurantMenu, MdReceiptLong } from "react-icons/md";
import { HiHome, HiPrinter } from "react-icons/hi";
import { HiMenu } from "react-icons/hi";

const Header: FC = () =>{

    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () => setIsOpen(false);

    return (
        <div className='no-print h-16 shadow-md w-screen bg-white flex justify-between items-center p-3 mb-8'>
           <div className="w-full md:hidden">
            <Button size="sm" color="light" className="border-0" onClick={() => setIsOpen(true)}>
                {/* <MdOutlineRestaurantMenu className="h-5 w-5" /> */}
                <HiMenu className="h-6 w-6" />
            </Button>
           </div>

            <Link href='/' className='flex text-4xl text-amber-600 w-full'>
             <TbHexagonLetterH />
             <TbHexagonLetterBFilled />
            </Link>

            <Link href="/" className=' hidden md:flex text-2xl font-bold text-amber-600 w-full text-center'>Hexa Bees</Link>
            
            <ul className=' hidden md:flex gap-6 px-4 w-full justify-end'>
              <li className='hover:text-amber-600 font-medium hover:underline hover:bg-slate-100 hover:font-medium active:scale-95 rounded transition-all'>
                <Link href="/" className="block px-4 py-2">Home</Link>
              </li>
              <li className='hover:text-amber-600 font-medium hover:underline hover:bg-slate-100 hover:font-medium active:scale-95 rounded transition-all'>
                <Link href="/menuList" className="block px-4 py-2">Menu</Link>
              </li>
              <li className='hover:text-amber-600 font-medium hover:underline hover:bg-slate-100 hover:font-medium active:scale-95 rounded transition-all'>
                <Link href="/billing" className="block px-4 py-2">Billing</Link>
              </li>
            </ul>

            {/* SideBar */}

            <Drawer open={isOpen} onClose={handleClose}>
                <Drawer.Header title="" titleIcon={() => 
                    <>
                    <Link href='/' className='flex text-4xl text-amber-600 w-full'>
                        <TbHexagonLetterH />
                        <TbHexagonLetterBFilled />
                    </Link>
                    </>
                } />
                <Drawer.Items>
                <Sidebar
                    aria-label="Sidebar with multi-level dropdown example"
                    className="[&>div]:bg-transparent [&>div]:p-0"
                >
                    <div className="flex h-full flex-col justify-between py-2">
                        <div>
                            <Sidebar.Items>
                            <Sidebar.ItemGroup>
                                <Sidebar.Item href="/" icon={HiHome}>
                                Home
                                </Sidebar.Item>
                                <Sidebar.Item href="/menuList" icon={MdReceiptLong}>
                                Menu List
                                </Sidebar.Item>
                                <Sidebar.Item href="/billing" icon={HiPrinter}>
                                Billing
                                </Sidebar.Item>
                            </Sidebar.ItemGroup>
                            </Sidebar.Items>
                        </div>
                    </div>
                </Sidebar>
                </Drawer.Items>
            </Drawer>

        </div>
    );
}

export default Header;

