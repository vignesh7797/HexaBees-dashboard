'use client';
import {
  Button,
  Card,
  FileInput,
  Label,
  Modal,
  Table,
  TextInput,
} from 'flowbite-react';
import { useState } from 'react';
import { HiPlus, HiOutlineUpload } from 'react-icons/hi';
import { FaRegImage } from "react-icons/fa6";
import { useMenuContext } from '../context/menuContext';
import { Menu } from '../common';



export default function Home() {
  const { menus, addMenu, updateMenu } = useMenuContext();

  const [openModal, setOpenModal] = useState(false);

  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [img, setImg] = useState<string | null>(null);

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

  const onCloseModal = () => {
    setOpenModal(false);
    setName('');
    setCategory('');
    setPrice(0);
    setIsEdit(false);
    setSelectedMenu(null);
  };

  const onAddMenu = () => {
    if (isEdit && selectedMenu) {
      const editedMenu:Menu = {
        id: selectedMenu.id,
        name: name,
        category: category,
        price: price,
        image : img || ''
      };
      updateMenu(editedMenu);
    } else {
      const newMenu:Menu = {
        id:0,
        name: name,
        category: category,
        price: price,
        image: img || '',
      };
      addMenu(newMenu);
    }

    onCloseModal();
  };

  const onEditMenu = (menu: Menu) => {
    setSelectedMenu(menu);
    setIsEdit(true);
    setName(menu.name);
    setCategory(menu.category);
    setPrice(menu.price);
    setImg(menu.image || null)
    setOpenModal(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImg(imageUrl);
    }
  }

  return (
    <>
      <h1>Menu List</h1>

      <div className="overflow-x-auto shadow-md w-[90vw] mx-auto p-2">
        <Button
          color="light"
          className="ml-auto my-2"
          onClick={() => setOpenModal(true)}
        >
          <HiPlus className="mr-2 h-5 w-5" />
          Add
        </Button>

        {/* Table */}

        <Table>
          <Table.Head>
            <Table.HeadCell>Id</Table.HeadCell>
            <Table.HeadCell>Image</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Quantity</Table.HeadCell>
            <Table.HeadCell>Price</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {menus.map((menu: Menu) => (
              <Table.Row
                key={menu.id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell> {menu.id}</Table.Cell>
                <Table.Cell> 
                  {
                  menu.image ? (
                  <img src={menu.image} width="40px"/>
                  ) 
                  : (
                    <div className="w-10 h-10 bg-slate-200 flex justify-center items-center">
                      <FaRegImage />
                    </div>
                  )
                  }
                  
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {menu.name}
                </Table.Cell>
                <Table.Cell>{menu.category}</Table.Cell>
                <Table.Cell>{menu.price}</Table.Cell>
                <Table.Cell>
                  <a
                    role="button"
                    className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                    onClick={() => {
                      onEditMenu(menu);
                    }}
                  >
                    Edit
                  </a>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

        {/* Model */}

        <Modal show={openModal}  popup onClose={onCloseModal}>
          <Modal.Header />
          <Modal.Body>
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                {isEdit ? 'Edit' : 'Add New'} Menu Item
              </h3>

              <div className="flex md:flex-row flex-col items-center gap-5">
                <div className="w-full">
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
                      <Label htmlFor="quantity" value="Category" />
                    </div>
                    <TextInput
                      id="quantity"
                      placeholder="Category"
                      type="text"
                      value={category}
                      onChange={(event) =>
                        setCategory(event.target.value)
                      }
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
                      onChange={(event) =>
                        setPrice(Number(event.target.value) || 0)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="w-full my-4">
                  <Card className=""
                    imgAlt="Recipe Image"
                    imgSrc={img ? img : ''}>
                    <div className="mb-2">
                      <div>
                        <Label htmlFor="default-file-upload" />
                      </div>
                      <Label className="focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:focus:ring-yellow-900 flex w-fit mx-auto">
                         <FileInput id="default-file-upload" className="hidden" onChange={handleFileChange} />
                         <HiOutlineUpload className="mr-2 h-5 w-5" />
                         Upload Image
                      </Label>
                      
                    </div>
                  </Card>
                </div>

              </div>

              <div className="w-full flex items-center justify-end gap-4">
                <Button outline color="light" onClick={onCloseModal}>
                  Cancel
                </Button>
                <Button
                  color="blue"
                  onClick={onAddMenu}
                  disabled={!name || !category || !price}
                >
                  {isEdit ? 'Save' : 'Add'}
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}
