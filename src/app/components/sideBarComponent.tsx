"use client"
import Link from "next/link";
import { FC, useState } from "react";
import Image from "next/image";


import { RiSidebarFoldFill, RiSidebarUnfoldFill } from "react-icons/ri";


import { usePathname } from 'next/navigation';
import { sideMenus } from "../common";




const SideBar: FC = () => {
    const pathname = usePathname();
    const [toggle, setToggle] = useState(true);

    return (
        <section className={`left-0 bg-white shadow-md h-screen w-0 transition-all duration-300 no-print ${toggle ? 'md:w-[80px]' : 'md:w-[16rem]'}`}>
            <div className={`flex gap-2 py-4 ${toggle ? 'px-4' : 'px-2'} transition-all`}>
                <Link href='/' className='flex items-center gap-4 text-4xl text-amber-600 mx-auto'>
                    <Image src={'/logo-sm.svg'} width={28} height={30} alt="Hexa Bees Icon"></Image>
                    {!toggle && (
                        <Image src={'/logo-text.svg'} width={120} height={30} alt="Hexa Bees Title"></Image>
                    ) }
                </Link>
            </div>

            <button className={`hidden md:block mx-4 btn-light py-2 px-2 text-grey ${toggle ? 'text-2xl' : 'text-xl'}`} onClick={() => setToggle(!toggle)}>
                    {toggle ? (<RiSidebarUnfoldFill />) : (<RiSidebarFoldFill />)}
            </button>

            <ul className="mt-16 hidden md:flex flex-col gap-4 mx-2 ">

                {sideMenus.map((menu) =>{
                    const Icon = menu.icon;
                    return(
                         <li key={menu.label}    className={`relative ps-4 hover:bg-orange-500 hover:bg-opacity-15 rounded group ${pathname == menu.link ? "bg-orange-500 bg-opacity-15 border-s-4 border-orange-500 text-orange-500"  : "bg-white text-grey"}`}>                                
                            <Link href={menu.link} className="">
                                <p className={`flex items-center gap-4 ${toggle ? 'text-2xl' : 'text-lg'} font-semibold font-acme tracking-wider h-12 transition-all duration-500`}>
                                    <span><Icon /></span>
                                    <span className={`transition-all duration-300 ${toggle ? 'text-[0px]' : 'text-lg'}`}>{menu.label}</span>
                                </p>
                            </Link>

                            {toggle && (
                                <div className="px-4 py-1.5 bg-white text-orange-500 shadow-md rounded absolute left-[110%] top-[15%] invisible group-hover:visible z-50">
                                    {menu.label}
                                </div>
                            )}
                        </li>
                    )
                })}

            </ul>

        </section>
    )
}

export default SideBar;