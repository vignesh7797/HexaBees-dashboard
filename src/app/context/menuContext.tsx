"use client"

import { createContext, ReactNode, useContext, useState } from "react";

export interface Menu {
    id : number
    name : string
    qty : number
    price : number
    img ? :string
}

interface MenuContextType {
    menus: Menu[];
    addMenu: (newMenu: Menu) => void;
    updateMenu: (updatedMenu: Menu) => void;
  }

  export const MenuContext = createContext<MenuContextType | undefined>({
    menus : [],
    addMenu : () => {throw new Error('addMenu function must be overridden by a provider')},
    updateMenu: () => {
        throw new Error('updateMenu function must be overridden by a provider');
      },
  });


export const MenuProvider = ({children}:{children:ReactNode}) =>{
    const [menus, setMenus] = useState<Menu[]>([
        { id: 1, name: "Veg Momo", qty: 0, price: 70, img:'https://picsum.photos/id/237/200/200' },
        { id: 2, name: "Paneer Momo", qty: 0, price: 80, img:'' },
        { id: 3, name: "Chicken Momo", qty: 0, price: 90, img:'https://picsum.photos/id/239/200/200' },
    ]); 

    const addMenu = (newMenu:Menu) => {
    setMenus([...menus, newMenu]);
    };

    const updateMenu = (updatedMenu:Menu) => {
    setMenus(menus.map((menu) => (menu.id === updatedMenu.id ? updatedMenu : menu)));
    };

    return (
        <MenuContext.Provider value={{ menus, addMenu, updateMenu }}>
          {children}
        </MenuContext.Provider>
    );
}

export const useMenuContext = () => {
    const context = useContext(MenuContext);
    if (!context) {
      throw new Error('useMenuContext must be used within a MenuProvider');
    }
    return context;
  };