'use client';
import {
  Button,
  Card,
  FileInput,
  Label,
  Modal,
  Select,
  Table,
  TextInput,
} from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiPlus, HiOutlineUpload, HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaRegImage } from "react-icons/fa6";
import { useMenuContext } from '../context/menuContext';
import { Menu } from '../common';
import Image from 'next/image';


export default function Home() {
  const { menus, addMenu, updateMenu, deleteMenu } = useMenuContext();

  const [openModal, setOpenModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [price, setPrice] = useState<number>(0);
  const [img, setImg] = useState<string | null>(null);
  const [type, setType] = useState('')
  
  const [search, setSearch] = useState<string>('');
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
        type : type,
        code : selectedMenu.code,
        category: category,
        price: price,
        image : img || ''
      };
      updateMenu(editedMenu);
    } else {
      const newMenu:Menu = {
        id : 0,
        name: name,
        code : 'TB' + (menus.length + 1),
        type : type,
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
    setImg(menu.image || null);
    setType(menu.type);
    setOpenModal(true);
  };

  const onDeleteMenu = (menu: Menu) =>{
    setOpenConfirmModal(true);
    setSelectedMenu(menu)
  }

  const onConfirm = () =>{
    setOpenConfirmModal(false);
    deleteMenu(selectedMenu.id)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImg(imageUrl);
    }
  }

  const onSearchHandle = (event:React.ChangeEvent<HTMLInputElement>) =>{
    setSearch(event.target.value);
  }

  useEffect(() =>{
    const cate = Array.from(new Set(menus.map((menu) => menu.category)));
    setCategoryList(cate)
  },[menus])

  return (
    <>
      <div className="overflow-x-auto bg-white rounded shadow-md w-[90vw] mx-auto p-2">
      <h1 className='text-2xl font-bold text-center'>Menu List</h1>

        <div className="flex justify-between items-center p-4">
          <div className='w-1/3 hidden md:block'></div>

          <TextInput id="search" className='w-full md:w-80' type='text' value={search} onChange={onSearchHandle} placeholder='Search Menu' sizing='sm'></TextInput>

          <Button size='sm' className="ml-auto my-2" onClick={() => setOpenModal(true)}>
            <HiPlus className="mr-2 h-5 w-5" />
            Add
          </Button>
        </div>
        

        {/* Table */}

        <Table>
          <Table.Head>
            <Table.HeadCell>Id</Table.HeadCell>
            <Table.HeadCell>Image</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Code</Table.HeadCell>
            <Table.HeadCell>Quantity</Table.HeadCell>
            <Table.HeadCell>Price</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {menus.filter(mn => mn.name.toLowerCase().includes(search.toLowerCase())).map((menu: Menu) => (
              <Table.Row
                key={menu.id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell> {menu.id}</Table.Cell>
                <Table.Cell> 
                  {
                  menu.image ? (
                  <Image src={menu.image} alt={menu.name} width={40} height={40} unoptimized/>
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
                <Table.Cell>{menu.code}</Table.Cell>
                <Table.Cell>{menu.category}</Table.Cell>
                <Table.Cell>{menu.price}</Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-6">
                    <a role="button" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500" onClick={() => {onEditMenu(menu);}}>
                      Edit
                    </a>

                    <a role="button" className="text-red-400 hover:underline" onClick={() => onDeleteMenu(menu)}>
                        Delete
                    </a>
                  </div>
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
                      <Label htmlFor="category" value="Category" />
                    </div>
                    <Select id='category' value={category} onChange={(event) => setCategory(event.target.value)}>
                      <option >Choose Category</option>
                      {categoryList.map((cate, ind) => {
                        return (
                          <option value={cate} key={ind}>{cate}</option>
                        )
                      })}
                    </Select>
                  </div>

                  <div>
                  <div className="mb-2 block">
                      <Label htmlFor="type" value="Type" />
                    </div>
                    <Select id='type' value={type} onChange={(event) => setType(event.target.value)}>
                      <option >Choose Type</option>
                      <option value={'Steam'}>Steam</option>
                      <option value={'Fried'}>Fried</option>
                    </Select>
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

        {/* Confirm Model */}
          <Modal show={openConfirmModal} size="md" onClose={() => setOpenConfirmModal(false)} popup>
            <Modal.Header />
            <Modal.Body>
              <div className="text-center">
                <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete this Menu?
                </h3>
                <div className="flex justify-center gap-4">
                  <Button color="failure" onClick={onConfirm}>
                    {"Yes, I'm sure"}
                  </Button>
                  <Button color="gray" onClick={() => setOpenConfirmModal(false)}>
                    No, cancel
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>

      </div>
    </>
  );
}
