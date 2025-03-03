"use client"

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import axios from 'axios';
import { Menu } from "../common";



interface MenuContextType {
    menus: Menu[];
    addMenu: (newMenu: Menu) => void;
    updateMenu: (updatedMenu: Menu) => void;
    deleteMenu : (id : number) => void;
  }

  export const MenuContext = createContext<MenuContextType | undefined>({
    menus : [],
    addMenu : () => {throw new Error('addMenu function must be overridden by a provider')},
    updateMenu: () => {
        throw new Error('updateMenu function must be overridden by a provider');
      },
    deleteMenu() {
      throw new Error('deleteMenu function must be overridden by a provider')
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
      const response = await fetch('/api/menu', {
        method:'POST',
        headers: { "Content-Type": "application/json" },
        body:JSON.stringify(newMenu)
      })

      const data = await response.json();
      if (response.ok){
        setMenus(prevObjects => [...prevObjects, newMenu]);
      } else{
        throw new Error(data.error || "Something went wrong");
      } 
      console.log(data)
      
    };

    const updateMenu = async (updatedMenu:Menu) => {
      const response = await fetch('/api/menu', {
        method: 'PUT',
        headers : {'Context-Type' : 'application/json'},
        body : JSON.stringify(updatedMenu)
      })

      const data = await response.json();

      if(response.ok){
        setMenus(menus.map((menu) => (menu.id === updatedMenu.id ? updatedMenu : menu)));
      }else{
        throw new Error(data.error || "Something went wrong");
      }

    };

    const deleteMenu = async (id:number) => {
      const response = await fetch('/api/menu', {
        method : 'DELETE',
        headers : {'Context-Type' : 'application/json'},
        body : JSON.stringify({id:id})
      })

      const data = await response.json();

      if(response.ok){
        setMenus(list =>list.filter(item => item.id !== id));
      }else{
        throw new Error(data.error || "Something went wrong");
      }
    }

    return (
        <MenuContext.Provider value={{ menus, addMenu, updateMenu, deleteMenu}}>
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