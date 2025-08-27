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
      const formData = new FormData();
      formData.append('id', newMenu.id.toString());
      formData.append('name', newMenu.name);
      formData.append('type', newMenu.type);
      formData.append('code', newMenu.code);
      formData.append('category', newMenu.category);
      formData.append('price', newMenu.price.toString());
      formData.append('imageFile', newMenu.imageFile);

      const response = await fetch('/api/menu', {
        method:'POST',
        body:formData
      })

      const { data } = await response.json();
      
      if (response.ok){
        setMenus(prevObjects => [...prevObjects, data[0]]);
      } else{
        throw new Error(data.error || "Something went wrong");
      } 
      
    };

    const updateMenu = async (updatedMenu:Menu) => {
      const formData = new FormData();
      formData.append('id', updatedMenu.id?.toString());
      formData.append('name', updatedMenu.name);
      formData.append('type', updatedMenu.type);
      formData.append('code', updatedMenu.code);
      formData.append('category', updatedMenu.category);
      formData.append('price', updatedMenu.price?.toString());
      formData.append('imageFile', updatedMenu.imageFile);

      const response = await fetch('/api/menu', {
        method: 'PUT',
        headers : {'Context-Type' : 'application/json'},
        body : formData
      })

      const {data} = await response.json();

      if(response.ok){
        setMenus(menus.map((menu) => (menu.id === data[0].id ? data[0] : menu)));
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