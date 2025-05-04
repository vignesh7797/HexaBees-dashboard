'use client';
import {
  Button,
  Drawer,
  DrawerItems,
  Dropdown,
  FileInput,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Table,
  TextInput,
} from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaRegImage } from "react-icons/fa6";
import { useMenuContext } from '../context/menuContext';
import { Menu, sortByList } from '../common';
import Image from 'next/image';
import imageCompression from 'browser-image-compression';

import { IoSearch, IoList, IoGridOutline, IoClose, IoSave } from "react-icons/io5";
import { TbArrowsSort } from "react-icons/tb";
import { IoMdClose } from "react-icons/io";
import { BiRupee, BiSolidCategory } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { FiPlus } from "react-icons/fi"
import { IoCloudUploadOutline } from "react-icons/io5"
import AutoComplete from '../components/autoComplete';
import { BsCaretUpSquare } from "react-icons/bs";
import { toTitleCase } from '../utils/textFormatter';
import { VscCircleFilled } from "react-icons/vsc";
import { FaEdit } from "react-icons/fa";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


export default function Home() {
  const { menus, addMenu, updateMenu, deleteMenu } = useMenuContext();

  const [filteredMenu, setFIlteredMenu] = useState([])
  const [openModal, setOpenModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [varientList, setVarientList] = useState([])
  const [price, setPrice] = useState<number>(0);
  const [img, setImg] = useState<string>(null);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [type, setType] = useState('')
  
  const [search, setSearch] = useState<string>('');
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

  const [selectedCategory, setSelectedCategory] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [subCategory, setSubCategory] = useState('');

  const [layout, setLayout] = useState('grid');
  const [showAddNew, setShowAddNew] = useState('');
  const [addNew, setAddNew] = useState('');
  const [showAddNewExist, setShowAddNewExist] = useState(false);
  const [varient, setVarient] = useState<'veg' | 'nonveg' | 'egg'>('veg');

  const onCloseModal = () => {
    setOpenModal(false);
    setName('');
    setCategory('');
    setPrice(0);
    setIsEdit(false);
    setSelectedMenu(null);
    setImg('');
    setType('')
  };

  const onAddMenu = async () => {
    let compressedFile = imgFile

    if(imgFile && imgFile.size / 1024 / 1024 > 0.9){

          const options = {
            maxSizeMB: 0.5, // Maximum size in MB
            maxWidthOrHeight: 1024, 
            useWebWorker: true, 
          };

          compressedFile = await imageCompression(imgFile, options);
    }
    

    if (isEdit && selectedMenu) {

      const editedMenu = {
        id: selectedMenu.id,
        name: name,
        type : type,
        code : selectedMenu.code,
        category: category,
        varient : varient,
        price: price,
        image : img,
        imageFile : compressedFile 
      };
      setSelectedMenu({...selectedMenu, image: img })
      updateMenu(editedMenu);
    } else {
      const newMenu = {
        id : 0,
        name: name,
        code : 'TB' + (menus.length + 1),
        type : type,
        category: category,
        price: price,
        image : img,
        imageFile : compressedFile
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
    setImg(menu.image);
    setType(menu.type);
    setOpenModal(true);
  };

  const onDeleteMenu = (menu: Menu) =>{
    setOpenConfirmModal(true);
    setSelectedMenu(menu);
    setSearch('');
  }

  const onConfirm = () =>{
    setOpenConfirmModal(false);
    deleteMenu(selectedMenu.id)
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) =>{
    if (event.target.files?.length) {
      const imageUrl = URL.createObjectURL(event.target.files[0]);
      setImg(imageUrl);
      setImgFile(event.target.files[0]);
    }
  }

  const onSearchHandle = (event?:React.ChangeEvent<HTMLInputElement>) =>{
    if(event)setSearch(event.target.value);
  }

  useEffect(() =>{
    if(menus && menus.length){
      const cate = Array.from(new Set(menus?.map((menu) => menu.category)));
      const vary = Array.from(new Set(menus?.map((menu) => menu.type).filter(typ => typ)));
      vary.unshift('')
      setCategoryList(cate);
      setVarientList(vary)
      setFIlteredMenu(menus);
    }
  },[menus])

  useEffect(() =>{
    doSearchFilter()
  },[search, selectedCategory, subCategory])

  function doSearchFilter() {
    const  searchFilter = menus.filter(mn => {
      const matchesSearch = search
                ? mn.name.toLowerCase().includes(search.toLowerCase())
                : true;

      const matchesCategory =
        selectedCategory.length === 0 || selectedCategory.includes(mn.category);

      let matchSubCategory = true;
      if(selectedCategory.includes('Momo') && subCategory){
        matchSubCategory = mn.type == subCategory;
      }

      return matchesSearch && matchesCategory && matchSubCategory;
    });

    setFIlteredMenu(searchFilter);
  }


  const handleSortBy = (sort) => {

    setSortBy(sort)

      switch (sort) {

        case 'recent':
          setFIlteredMenu(menus.sort((a,b) => b.id - a.id))
          break;
  
        case 'low' : 
          setFIlteredMenu(menus.sort((a,b) => a.price - b.price))
          break;
  
        case 'high' : 
          setFIlteredMenu(menus.sort((a,b) => b.price - a.price))
          break
  
        case 'asc' : 
          setFIlteredMenu(menus.sort((a,b) => a.name.localeCompare(b.name)))
          break
  
        case 'desc' : 
          setFIlteredMenu(menus.sort((a,b) => b.name.localeCompare(a.name)))
          break
      
        default:
          break;
      }
    
  }

  const handleAddNew = () =>{
    const isExist = (showAddNew == 'Category' ? categoryList : varientList).find(cat => cat.toLowerCase() == addNew.toLowerCase());
    if(isExist){
      setShowAddNewExist(true)
    }else{
      if(showAddNew == 'Category'){
        setCategory(addNew)
      }else{
        setType(addNew);
      }
    }
  }

  const handleAddNewClose = () =>{
    setAddNew('');
    setShowAddNew('')
    setShowAddNewExist(false);
  }

  return (
    <>
      <section className='md:p-4 h-[94vh]'>

          <div className='bg-white rounded-md p-2 md:p-4 w-full flex flex-wrap justify-between items-center gap-4 break-anywhere h-fit'>
            <div className="flex w-full md:w-[300px]">
              <div className="relative w-full">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-grey">
                    <IoSearch />
                </div>
                <input name='search' type="text" id="search" value={search} onChange={onSearchHandle} className="bg-transparent border border-slate-200 text-grey text-sm rounded-s-lg focus:ring-orange-500 focus:border-amber-300 block w-full px-10 p-2.5  dark:bg-grey dark:border-grey dark:placeholder-grey dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-400" placeholder="Search Items..." autoFocus required />
                {search && (
                  <button type='button' className="absolute inset-y-0 end-0 flex items-center pe-3 text-grey z-10" onClick={()=>setSearch('')}>
                    <IoClose />
                  </button>
                )}
              </div>
              <button type="button" className='bg-orange-500 bg-opacity-15 text-orange-500 rounded-none rounded-e-lg h-[42px]' onClick={doSearchFilter}>
                    <IoSearch />
              </button>
            </div>

            <div className='flex gap-4'>
              <Dropdown inline renderTrigger={() => 
                  <Button color='light' size="sm" className='border-slate-200 focus:ring-orange-300 text-grey'>
                    <TbArrowsSort className="mr-2 h-5 w-5" />
                    Sort by
                  </Button>
                  }
                >
                {sortByList && sortByList.map(sort => (
                  <Dropdown.Item key={sort.param} onClick={() => handleSortBy(sort.param)} className={sortBy == sort.param && 'bg-orange-500 bg-opacity-15 text-orange-500 border-l-2 border-orange-500'}>
                    {sort.label}
                  </Dropdown.Item>
                ))}
              </Dropdown>

              <div className='md:hidden'>
                <Dropdown inline renderTrigger={() => 
                    <Button color='light' size="sm" className='border-slate-200 focus:ring-orange-300 text-grey'>
                      <BiSolidCategory className="mr-2 h-5 w-5" />
                      Category
                    </Button>
                    }
                  >

                    <Dropdown.Item onClick={() => {
                          setSelectedCategory([])
                      }} className={selectedCategory.length == 0 && 'bg-orange-500 bg-opacity-15 text-orange-500 border-l-2 border-orange-500'}>
                            All
                      </Dropdown.Item>

                    {categoryList.map(cate => (
                      <Dropdown.Item key={cate} onClick={() => {
                        if(selectedCategory.includes(cate)){
                          setSelectedCategory((prevItems) => prevItems.filter((item) => item !== cate))
                        }else setSelectedCategory([...selectedCategory, cate])
                      }} className={selectedCategory.includes(cate) && 'bg-orange-500 bg-opacity-15 text-orange-500 border-l-2 border-orange-500'}>
                            {cate}
                      </Dropdown.Item>
                    ))}

                </Dropdown>
              </div>
            </div>

            <div className="hidden md:flex w-full items-center overflow-x-auto flex-nowrap gap-2 custom-scrollbar">
              <button className={`${selectedCategory.length == 0 ? 'text-orange-500 border-0 border-l-2 border-orange-500 bg-orange-500 bg-opacity-15' : 'text-gray-400 border-[1px] border-gray-300'}  shrink-0  w-fit rounded hover:bg-orange-50 focus:ring-orange-300 focus:ring-1 h-8 px-3 my-1`}
                  onClick={() => {
                      setSelectedCategory([])
                  }} >
                    <span className='flex items-center gap-1'>
                      All 
                    </span>
              </button>

              {categoryList && categoryList.map(cate => (
                  <button key={cate} className={`${selectedCategory.includes(cate) ? 'text-orange-500 border-0 border-l-2 border-orange-500 bg-orange-500 bg-opacity-15' : 'text-gray-400 border-[1px] border-gray-300'}  shrink-0  w-fit rounded hover:bg-orange-50 focus:ring-orange-300 focus:ring-1 h-8 px-3 my-1`}
                  onClick={() => {
                    if(selectedCategory.includes(cate)){
                      setSelectedCategory((prevItems) => prevItems.filter((item) => item !== cate))
                    }else setSelectedCategory([...selectedCategory, cate])

                  }}>
                    <span className='flex items-center gap-1'>
                      {cate} {selectedCategory.includes(cate) && <IoMdClose />}
                    </span>
                  </button>
                ))}
            </div>
          </div>

          <div className="overflow-x-auto w-full bg-white shadow-lg rounded-lg p-2 md:p-4 mt-3 mb-16 break-anywhere h-[84%]">  

            <div className="flex justify-between items-center mb-4">
              {selectedCategory.includes('Momo') && (
                <div className="flex gap-2">
                  <button className={`${subCategory == 'Steam' ? 'text-orange-500 border-0 border-l-2 border-orange-500 bg-orange-500 bg-opacity-1' : 'text-gray-400 border-[1px] border-gray-300'}  shrink-0  w-fit rounded hover:bg-orange-50 focus:ring-orange-300 focus:ring-1 h-8 px-3 my-1`}
                        onClick={() => {
                            setSubCategory('Steam');
                        }} >
                          <span className='flex items-center gap-1'>
                            Steam 
                          </span>
                    </button>
                    <button className={`${subCategory == 'Fried' ? 'text-orange-500 border-0 border-l-2 border-orange-500 bg-orange-500 bg-opacity-15' : 'text-gray-400 border-[1px] border-gray-300'}  shrink-0  w-fit rounded hover:bg-orange-50 focus:ring-orange-300 focus:ring-1 h-8 px-3 my-1`}
                        onClick={() => {
                          setSubCategory('Fried');
                        }} >
                          <span className='flex items-center gap-1'>
                            Fried 
                          </span>
                  </button>
              </div>
              )}

              <div className='ml-auto flex gap-8'>

                <button className='flex items-center gap-1 px-4 py-1 rounded font-acme font-bold bg-orange-500 bg-opacity-10 text-orange-500 active:scale-90 transition-all' onClick={() => setOpenModal(true)}>
                  <FiPlus className='text-xl md:text-base'/> 
                  <span className='hidden md:block'>Add Item</span>
                </button>

                <div className="hidden md:flex rounded bg-gray-100 p-1 ml-auto">
                  <label htmlFor="list" className={`p-1.5 cursor-pointer rounded text-md ${layout == 'list' ? 'bg-white shadow text-orange-500' : 'text-grey'}`}>
                    <input type="radio" name="layout" id="list" value={layout} className='hidden' onChange={() => setLayout('list')} />
                    <IoList/>
                  </label>

                  <label htmlFor="grid" className={`p-1.5 cursor-pointer rounded text-md ${layout == 'grid' ? 'bg-white shadow text-orange-500' : 'text-grey'}`}>
                    <input type="radio" name="layout" id="grid" value={layout} className='hidden' onChange={() => setLayout('grid')} />
                    <IoGridOutline />
                  </label>
                </div>

              </div>

            </div>

            {menus ? (

            <div className='h-[93%] overflow-y-auto'>
            
                {layout == 'grid' ? (
                    <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 grid-auto-rows-[1fr] items-center justify-between gap-3">
                      {filteredMenu.map((menu: Menu) => (
                          <div key={menu.id} className="border-[1px] border-gray-100 rounded cursor-pointer h-full relative" onClick={() => {onEditMenu(menu)}}>
                            {
                              menu.image ? (
                                <img src={menu.image.toString() || img.toString()} alt={menu.name} width={'100%'} height={'auto'} className='aspect-square' loading="lazy"/>
                              ) 
                              : (
                                <div className="w-full h-auto aspect-square bg-slate-200 text-slate-500 text-3xl flex justify-center items-center">
                                  <FaRegImage />
                                </div>
                              )
                            }
                            <p className='absolute top-0 left-0 bg-black bg-opacity-35 rounded-br-md px-2 py-1 flex items-center font-bold text-sm font-acme text-slate-100'> 
                              {menu.category}
                            </p>
                            <div className='p-2 relative'>
                              <p className='font-semibold font-adlm text-base text-black'>{menu.name} {menu.type && (<span className='text-xs text-gray-400'>({menu.type})</span>)}</p>
                              <p className='flex items-center font-bold mt-1 text-lg font-acme text-gray-600'> 
                                  {menu.varient && (
                                    <span className={`border-[1px]  rounded-sm mr-2 ${menu.varient == 'veg' ? 'border-green-500' : (menu.varient == 'egg' ? 'border-amber-700' : 'border-red-500')}`}>
                                      <VscCircleFilled className={`text-lg ${menu.varient == 'veg' ? 'text-green-500' : (menu.varient == 'egg' ? 'text-amber-700' : 'text-red-500')}`} />
                                    </span>
                                  )}

                                  <BiRupee /> {menu.price}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>

                    ) : (

                    <Table>
                      <Table.Head>
                        <Table.HeadCell className='py-6 text-grey font-adlm bg-white'>Id</Table.HeadCell>
                        <Table.HeadCell className='py-6 text-grey font-adlm bg-white'>Image</Table.HeadCell>
                        <Table.HeadCell className='py-6 text-grey font-adlm bg-white'>Name</Table.HeadCell>
                        <Table.HeadCell className='py-6 text-grey font-adlm bg-white'>Type</Table.HeadCell>
                        <Table.HeadCell className='py-6 text-grey font-adlm bg-white'>Code</Table.HeadCell>
                        <Table.HeadCell className='py-6 text-grey font-adlm bg-white'>Quantity</Table.HeadCell>
                        <Table.HeadCell className='py-6 text-grey font-adlm bg-white'>Price</Table.HeadCell>
                        <Table.HeadCell className='py-6 text-grey font-adlm bg-white'>Action</Table.HeadCell>
                      </Table.Head>
                      <Table.Body className="divide-y">
                        {filteredMenu.map((menu: Menu, ind:number) => (
                          <Table.Row
                            key={menu.id}
                            className="bg-white dark:border-gray-700 dark:bg-gray-800"
                          >
                            <Table.Cell> {ind+1}</Table.Cell>
                            <Table.Cell> 
                              {
                              menu.image ? (
                              <Image className='rounded' src={menu.image.toString() || img.toString()} alt={menu.name} width={40} height={40} unoptimized  loading="lazy"
                              quality={75}/>
                              ) 
                              : (
                                <div className="w-10 h-10 bg-slate-200 flex justify-center items-center rounded">
                                  <FaRegImage />
                                </div>
                              )
                              }
                            </Table.Cell>
                            <Table.Cell className="w-50 text-wrap font-adlm text-gray-900 dark:text-white">
                              {menu.name}
                            </Table.Cell>
                            <Table.Cell className="font-adlm text-gray-900 dark:text-white">
                              {menu.varient == 'veg' ? (
                                <a role="button" className="font-medium text-green-500 bg-green-500 bg-opacity-10 px-3 py-0.5 rounded hover:underline dark:text-green-500">
                                  Veg
                                </a>
                              ) : (menu.varient == 'nonveg' ? (
                                <a role="button" className="font-medium text-red-500 bg-red-500 bg-opacity-10 px-3 py-0.5 rounded hover:underline dark:text-red-500">
                                  Non Veg
                                </a>
                              ) : menu.varient == 'egg' ? (
                                <a role="button" className="font-medium text-amber-700 bg-amber-700 bg-opacity-10 px-3 py-0.5 rounded hover:underline dark:text-amber-700">
                                  Egg
                                </a>
                              ) : (
                                <></>
                              ))}
                            </Table.Cell>
                            <Table.Cell>{menu.code}</Table.Cell>
                            <Table.Cell>{menu.category}</Table.Cell>
                            <Table.Cell>{menu.price}</Table.Cell>
                            <Table.Cell>
                              <div className="flex items-center gap-6">
                                <a role="button" className="font-medium text-cyan-600 bg-cyan-600 bg-opacity-10 px-3 py-0.5 rounded hover:underline dark:text-cyan-500" onClick={() => {onEditMenu(menu);}}>
                                  Edit
                                </a>

                                <a role="button" className="font-medium text-orange-500 bg-orange-500 bg-opacity-10 px-3 py-0.5 rounded hover:underline dark:text-orange-500" onClick={() => onDeleteMenu(menu)}>
                                    Delete
                                </a>
                              </div>
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table>

                )}

            </div>
            ) : (
              <div className="w-[93%] h-[90%] flex flex-col justify-center items-center">
                  <div className="w-56 h-56">
                      <DotLottieReact
                          src={'/lottie/load_food.lottie'}
                          loop
                          autoplay
                          width={100}
                          height={100}
                          speed={1}
                      />
                  </div>
                  <p className="text-orange-300 font-acme text-center text-lg">Wait for a minute... <br/> <span className="text-base"> or check you internet connection and reload the page again.</span></p>
              </div>
            )}

          </div>

      </section>

      <Drawer open={openModal} onClose={onCloseModal} position="right" className='w-full md:w-[30vw]'>
        <DrawerItems className='h-full'>
          <form onSubmit={onAddMenu} className='h-full'>
            <div className='w-full flex flex-col h-full'>
                <div className="w-full bg-white flex justify-between mb-auto ">
                  <button type='button' className='font-bold text-xl active:scale-90 transition-all' onClick={() => setOpenModal(false)}><IoClose/></button>
                  <button type='button' onClick={()=>onDeleteMenu(selectedMenu)} className='bg-red-700 text-white flex items-center gap-2'>
                    <span><MdDelete /></span> 
                    <span>Delete Item</span>
                  </button>
                </div>

                <div className="h-full overflow-auto pt-6 overflow-y-auto">
                    
                      <div className="w-full mb-4">
                          <div className="mb-2 block">
                            <Label htmlFor="name">Recipe Name</Label>
                          </div>
                          <TextInput id="name" type="name" placeholder="e.g Noodels" value={name} onChange={(event) => setName(event.target.value)} required />
                      </div>

                      <div className="w-full my-4 p-0.5">
                        <div className="mb-2 block">
                            <Label htmlFor="category">Category</Label>
                        </div>
                        <AutoComplete list={categoryList} keyName='' onSelect={async (e) => setCategory(e)} defaultValue={category}></AutoComplete>
                        
                        <button type='button' className='my-2 text-orange-400 text-xs font-adlm p-0 h-fit' onClick={()=>setShowAddNew('Category')}>Add Category</button>
                      </div>

                      <div className="w-full my-4 p-0.5">
                        <div className="mb-2 block">
                            <Label htmlFor="category">Varient</Label>
                        </div>
                        <AutoComplete list={varientList} keyName='' onSelect={async (e) => setType(e)} defaultValue={type}></AutoComplete>
                        
                        <button type='button' className='my-2 text-orange-400 text-xs font-adlm p-0 h-fit' onClick={()=>setShowAddNew('Varient')}>Add Varient</button>
                      </div>

                      <div>
                        <div className="mb-2 block">
                            <Label htmlFor="type">Type</Label>
                        </div>


                          <div className="flex gap-4">
                            <label className={`cursor-pointer flex items-center justify-start gap-2 px-3 py-1.5 text-sm font-acme rounded w-fit border-[1px] ${'veg' == varient ? `border-orange-500 bg-orange-500 bg-opacity-15 ` : `border-gray-400 text-gray-400 bg-white`}` }>
                              <span className='border-[1px] border-green-500 rounded'>
                                <VscCircleFilled className='text-green-500 text-lg' />
                              </span>
                              {toTitleCase('veg')}
                              <input type="radio" name="type" id="" value={varient} className='hidden' onChange={()=> setVarient('veg')} />
                            </label>

                            <label className={`cursor-pointer flex items-center justify-start gap-2 px-3 py-1 text-sm font-acme rounded w-fit border-[1px] ${'nonveg' == varient ? `border-orange-500 bg-orange-500 bg-opacity-15` : `border-gray-400 text-gray-400 bg-white`}` }>
                              <BsCaretUpSquare className='text-lg text-red-500' />
                              {toTitleCase('nonveg')}
                              <input type="radio" name="type" id="" value={varient} className='hidden' onChange={()=> setVarient('nonveg')} />
                            </label>

                            <label className={`cursor-pointer flex items-center justify-start gap-2 px-3 py-1.5 text-sm font-acme rounded w-fit border-[1px] ${'egg' == varient ? `border-orange-500 bg-orange-500 bg-opacity-15` : `border-gray-400 text-gray-400 bg-white`}` }>
                              <BsCaretUpSquare className='text-lg text-amber-700' />
                              {toTitleCase('egg')}
                              <input type="radio" name="type" id="" value={varient} className='hidden' onChange={()=> setVarient('egg')} />
                            </label>
                          </div>

                      </div>

                      <div className="w-full my-4 p-1">
                          <div className="mb-2 block">
                            <Label htmlFor="name">Price</Label>
                          </div>
                          {/* <TextInput id="name" type="name" placeholder="e.g Noodels" value={price} inputMode="numeric" pattern="[0-9]*" onChange={(event) => setPrice(Number(event.target.value))} required /> */}
                          <input type="number" id="number-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-400 focus:border-gray-400 block w-full p-2.5" placeholder="0.00" value={price} min={0} pattern="[0-9]*" onChange={(event) => setPrice(Number(event.target.value))}  required />
                      </div>

                      <div className="w-fit my-4">
                          <div className="mb-2 block">
                            <Label htmlFor="name">Image</Label>
                          </div>
                          {img ? (
                            <div className='w-32 h-32 border-[1px] border-orange-500 rounded relative group'>
                                <img src={img} width='100%' className='h-full' alt='Image' />
                                {/* <Image src={encodeURI(img)} width={200} height={200} alt={name}></Image> */}
                                <div className="absolute opacity-0 group-hover:opacity-100 top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-40">
                                  <Label className='px-2 py-1.5 absolute cursor-pointer border-[1px] border-white rounded text-sm flex items-center gap-2 text-white'>
                                    <FaEdit/> Change
                                    <FileInput id="default-file-upload" className="hidden" onChange={handleFileChange} accept="image/*" />
                                  </Label>
                                </div>
                            </div>
                          ) : (
                            <div className='cursor-pointer rounded border-[1px] border-orange-500 bg-orange-500 bg-opacity-10 w-32 h-32 flex items-center justify-center relative text-3xl text-orange-500 font-bold'>
                                <IoCloudUploadOutline />
                                <Label className='w-full h-full absolute cursor-pointer'>
                                  <FileInput id="default-file-upload" className="hidden" onChange={handleFileChange} accept="image/*" />
                                </Label>
                            </div>
                          )}
                          
                      </div>
                    
                </div>

                <div className="w-full sticky bottom-0 bg-white border-t-[1px] pt-4 flex justify-end gap-4">
                  <button type='button' className='flex items-center gap-1.5  text-red-500 py-2 px-5 text-base rounded font-acme active:scale-90 transition-all' onClick={onCloseModal}> Discard </button>
                  <button type='submit' className='flex items-center gap-1.5 text-white bg-orange-500 py-2 px-5 text-base rounded font-acme active:scale-90 transition-all' onClick={onAddMenu} disabled={!name || !price || !varient || !category}><IoSave/> Save Changes </button>
                </div>
            </div>
          </form>
        </DrawerItems>
      </Drawer>

      {/* <Modal dismissible show={openModal} size={'md'} onClose={() => setOpenModal(false)} className='animate-slideUp'>
        <Modal.Header>{name}</Modal.Header>
        <Modal.Body>
          <form onSubmit={onAddMenu}>

              <div className='w-full my-2'>
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

              <div className='w-full my-2'>
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

              <div className='w-full my-2'>
                <div className="mb-2 block">
                    <Label htmlFor="type" value="Type" />
                </div>
                <Select id='type' value={type} onChange={(event) => setType(event.target.value)}>
                  <option >Choose Type</option>
                  <option value={'Steam'}>Steam</option>
                  <option value={'Fried'}>Fried</option>
                </Select>
              </div>

              <div className='w-full my-2'>
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

              <div className="w-full my-4">
                  <Card className=""
                    imgAlt="Recipe Image"
                    imgSrc={img ? img : ''}>
                    <div className="mb-2">
                      <div>
                        <Label htmlFor="default-file-upload" />
                      </div>
                      <Label className="cursor-pointer focus:outline-none text-white bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:focus:ring-yellow-900 flex w-fit mx-auto">
                         <FileInput id="default-file-upload" className="hidden" onChange={handleFileChange} accept="image/*" />
                         <HiOutlineUpload className="mr-2 h-5 w-5" />
                         Upload Image
                      </Label>
                      
                    </div>
                  </Card>
              </div>


            <div className="flex justify-end gap-2 mt-6">
              <Button type='submit' color='blue' onClick={onAddMenu}>Update</Button>
              <Button color="gray" onClick={() => setOpenModal(false)}> Cancel </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal> */}

      {/* <div className="overflow-x-auto bg-white rounded shadow-md w-[90vw] mx-auto p-2">
        <h1 className='text-2xl font-bold text-center'>Menu List</h1>

        <div className="flex justify-between items-center p-4">
          <div className='w-1/3 hidden md:block'></div>

          <TextInput id="search" className='w-full md:w-80' type='text' value={search} onChange={onSearchHandle} placeholder='Search Menu' sizing='sm'></TextInput>

          <Button size='sm' className="ml-auto my-1" onClick={() => setOpenModal(true)}>
            <HiPlus className="mr-2 h-5 w-5" />
            Add
          </Button>
        </div>
        


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
                  <Image src={menu.image || img} alt={menu.name} width={40} height={40} unoptimized  loading="lazy"
                  quality={75}/>
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
                         <FileInput id="default-file-upload" className="hidden" onChange={handleFileChange} accept="image/*" />
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
                  color="orange"
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
      */}

      <Modal show={openConfirmModal} size="md" onClose={() => setOpenConfirmModal(false)} popup>
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this Menu?
              </h3>
              <div className="flex justify-center gap-4">
                <button className='bg-orange-600 text-white font-acme px-4 rounded hover:bg-orange-700 h-10 hover:shadow' onClick={onConfirm}>
                  {"Yes, I'm sure"}
                </button>
                <button className='bg-white border-[1px] border-gray-200 text-grey font-acme px-4 rounded hover:bg-gray-50 h-10 hover:shadow' onClick={() => setOpenConfirmModal(false)}>
                  No, cancel
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>


        <Modal show={showAddNew ? true : false} size="md" onClose={handleAddNewClose} popup>
          <ModalHeader/>
          <ModalBody>
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">Add New {showAddNew}</h3>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="category">{showAddNew}</Label>
                </div>
                <TextInput
                  id="category"
                  placeholder={showAddNew == 'Varient' ? 'e.g Steam' : "e.g Momo"}
                  value={addNew}
                  onChange={(event) => {setAddNew(event.target.value); setShowAddNewExist(false)}}
                  required
                />
                {showAddNewExist && (<p className='text-rose-600 text-sm my-1 font-adlm'>This {showAddNew} already exist!</p>)}
              </div>

              <div className="flex gap-3 w-full justify-end">
                <button className='bg-orange-500 text-white rounded active:scale-90 transition-all px-3 py-1 font-acme disabled:opacity-30' onClick={handleAddNew} disabled={!addNew}>Add</button>
                <button className='bg-white text-cyan-500 rounded active:scale-90 transition-all px-3 py-1 font-acme' onClick={handleAddNewClose}>Cancel</button>
              </div>

            </div>
          </ModalBody>
        </Modal>
    </>
  );
}
