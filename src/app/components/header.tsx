'use client';

import { FC, useState } from "react";
import Link from "next/link";
import { Button, Drawer, Sidebar } from "flowbite-react";
import { HiMenu } from "react-icons/hi";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { toTitleCase } from "../utils/textFormatter";
import { HiOutlineStatusOnline, HiOutlineStatusOffline } from "react-icons/hi";
import { sideMenus } from "../common";



const Header: FC = () =>{

    const [isOpen, setIsOpen] = useState(false);
    const [isOnline, setOnline] = useState(false);

    const handleClose = () => setIsOpen(false);
    const path = usePathname();
    const pathname = usePathname().split('/')[1];

    return (
        <div className='no-print h-16 shadow w-full bg-white flex justify-between items-center p-3 z-[49]'>
           <div className="w-fit md:hidden">
            <Button size="sm" color="light" className="border-0 focus:ring-0 text-primary" onClick={() => setIsOpen(true)}>
                <HiMenu className="h-6 w-6" />
            </Button>
           </div>

           <h1 className="text-2xl text-grey font-semibold px-4 font-acme tracking-wider">{pathname ? toTitleCase(pathname) : 'Dashboard'}</h1>

           <button className={`text-2xl ${isOnline ? 'text-green-500' : 'text-grey'}`} onClick={() =>setOnline(!isOnline)}>
                {isOnline ? (<HiOutlineStatusOnline />) : (<HiOutlineStatusOffline />)}
           </button>


            {/* SideBar */}
            <Drawer backdrop={true} open={isOpen} onClose={handleClose}>
                <Drawer.Header title="" titleIcon={() => 
                    <>
                        <Link href='/' className='flex text-4xl text-amber-600 w-full'>
                            <Image src={'/logo-title.svg'} width={160} height={30} alt="Hexa Bees"></Image>
                        </Link>
                    </>
                } />
                <Drawer.Items>

                <Sidebar
                    aria-label="Sidebar with multi-level dropdown example"
                    className="[&>div]:bg-transparent [&>div]:p-0 w-full"
                >
                    <div className="flex h-full flex-col justify-between py-2">
                        <Sidebar.Items>
                            <Sidebar.ItemGroup>

                                {sideMenus.map(menu =>{
                                    return (
                                        <Sidebar.Item key={menu.label} href={menu.link} icon={menu.icon} className={`hover:bg-primary hover:bg-opacity-15 rounded font-acme font-semibold text-lg  ${path == menu.link ? 'bg-primary bg-opacity-15 border-s-4 border-primary text-primary' :'text-grey'}`}>
                                             {menu.label}
                                        </Sidebar.Item>
                                    )
                                })}
                            </Sidebar.ItemGroup>
                        </Sidebar.Items>
                    </div>
                </Sidebar>
                </Drawer.Items>
            </Drawer>

        </div>
    );
}

export default Header;

