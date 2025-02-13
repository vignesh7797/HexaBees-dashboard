"use client"
import { useMenuContext } from "../context/menuContext";

export default function Home() {
    const { menus } = useMenuContext();

    return (
        <div style={{ padding: '20px' }}>
          <h1>Menu Details</h1>
          <ul>
            {menus.map((menu) => (
              <li key={menu.id}>
                {menu.name} - ${menu.price}
              </li>
            ))}
          </ul>
        </div>
      );
}