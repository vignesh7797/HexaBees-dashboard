"use client";
import {
  Button,
  Checkbox,
  Label,
  Modal,
  Table,
  TextInput,
} from "flowbite-react";
import { useContext, useState } from "react";
import { HiPlus } from "react-icons/hi";
import { MenuContext, useMenuContext } from "../context/menuContext";

interface Menu {
    id : number
    name : string
    qty : number
    price : number
}

export default function Home() {
  const { menus, addMenu, updateMenu } = useMenuContext();

  const [openModal, setOpenModal] = useState(false);

  const [name, setName] = useState<string>('');
  const [qty, setQty] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

  const onCloseModal = () =>{
    setOpenModal(false);
    setName('');
    setQty(0);
    setPrice(0);
    setIsEdit(false);
    setSelectedMenu(null);
  }

  const onAddMenu = () => {
    if(isEdit && selectedMenu){
        const editedMenu = {id:selectedMenu.id, name:name, qty:qty, price:price}
        updateMenu(editedMenu)
    } else {
        const newMenu = {
            id: menus.length + 1,
            name : name,
            qty : qty,
            price : price
        }
        addMenu(newMenu)
    }
    
    onCloseModal();
  }

  const onEditMenu = (menu:any) => {
    setSelectedMenu(menu);
    setIsEdit(true);
    setName(menu.name)
    setQty(menu.qty)
    setPrice(menu.price);
    setOpenModal(true); 
  }

  return (
    <>
      <h1>Menu List</h1>

      <div className="overflow-x-auto shadow-md w-[90vw] mx-auto p-2">
        <Button color="light" className="ml-auto my-2" onClick={() => setOpenModal(true)}>
          <HiPlus className="mr-2 h-5 w-5" />
          Add
        </Button>

        <Table>
          <Table.Head>
            <Table.HeadCell>Product Id</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Quantity</Table.HeadCell>
            <Table.HeadCell>Price</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {menus.map((menu: any) => (
              <Table.Row
                key={menu.id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell> {menu.id}</Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {menu.name}
                </Table.Cell>
                <Table.Cell>{menu.qty}</Table.Cell>
                <Table.Cell>{menu.price}</Table.Cell>
                <Table.Cell>
                  <a
                    role="button"
                    className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                    onClick={() => {onEditMenu(menu)}}>
                    Edit
                  </a>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

        {/* Model */}
        <Modal show={openModal} size="md" popup onClose={onCloseModal}>
          <Modal.Header />
          <Modal.Body>
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                {isEdit ? 'Edit' : "Add New"}  Menu Item
              </h3>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name" value="Receipe Name" />
                </div>
                <TextInput
                  id="name"
                  placeholder="Receipe"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="quantity" value="Receipe Quantity" />
                </div>
                <TextInput
                  id="quantity"
                  placeholder="Quantity"
                  type="number"
                  value={qty}
                  onChange={(event) => setQty(Number(event.target.value) || 0)}
                  required
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="price" value="Enter Price" />
                </div>
                <TextInput
                  id="price"
                  placeholder="Quantity"
                  type="number"
                  value={price}
                  onChange={(event) => setPrice(Number(event.target.value) || 0)}
                  required
                />
              </div>

              <div className="w-full flex items-center justify-end gap-4">
                <Button outline color="light" onClick={onCloseModal}>Cancel</Button>
                <Button color="blue" onClick={onAddMenu} disabled={!name || !qty || !price}>{isEdit ? 'Save' : 'Add'}</Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}


