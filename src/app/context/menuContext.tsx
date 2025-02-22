"use client"

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import axios from 'axios';
import { Menu } from "../common";



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
    const [menus, setMenus] = useState<Menu[]>([]); 

    useEffect(() => {
      fetchMenuList();
    }, []);

    const fetchMenuList = async () =>{
      const { data } = (await axios.get('/api/menu'));
      setMenus(data);
    }

    const addMenu = async (newMenu:Menu) => {
      const { data } = await axios.post('/api/menu', {body : newMenu})
      console.log(data)
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