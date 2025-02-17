'use client';
import { Menu, useMenuContext } from '../context/menuContext';
import { HiMinus, HiPlus } from 'react-icons/hi';
import { Button, Card, TextInput  } from 'flowbite-react';
import { BiRupee } from 'react-icons/bi';
import { ImLeaf } from 'react-icons/im';
import { TbBrandHexo, TbHexagonLetterB } from 'react-icons/tb';
import { useEffect, useState } from 'react';
import { HiOutlineSearch } from 'react-icons/hi';
import { FaUser } from 'react-icons/fa6';

interface BillMenu {
  id:number,
  name:string,
  qty:number,
  price : number
  img ?:string,
  isAdded ? :boolean,
}


export default function Home() {
  const { menus } = useMenuContext();

  const [filteredList, setFilteredList] = useState<BillMenu[]>(menus);
  const [search, setSearch] = useState<string>('');
  const [total, setTotal] = useState<number>(0);
  const [subTotal, setSubTotal] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);

  var date = new Date();

  var formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  var formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const onSearchHandle = (event:any) =>{
    console.log(event);
    setSearch(event.target.value)
    setFilteredList(menus.filter((menu:Menu)=> menu.name?.toLowerCase().includes(event.target.value?.toLowerCase())))
  }

  const onAdd = (menu:BillMenu) =>{
    setFilteredList(list => 
      list.map(item => item.id == menu.id ? {...item, isAdded : true, qty:1} : item)
    )
  }

  const onIncrease = (menu:BillMenu) =>{
    setFilteredList(list => 
      list.map(item => item.id === menu.id ? {...item, qty:item.qty + 1} : item)
    )
  }

  const onDecrease = (menu:BillMenu) =>{
    setFilteredList(list => 
      list.map(item => item.id === menu.id ? {...item, qty: item.qty-1, isAdded:item.qty == 1 ? false : true} : item)
    )
  }

  useEffect(() =>{
    var count = 0;
      filteredList.forEach(list => {
        count = count + (list.price*list.qty);
      });
    setSubTotal(count);
    setTotal(count)

  },[filteredList])

  useEffect(() =>{
    if(discount > 0){
      setTotal(Math.round(subTotal - (subTotal*(discount/100))))
    }else{
      setTotal(subTotal)
    }
  },[discount])

  return (
    <div className='flex flex-col md:flex-row print:flex-col w-screen md:p-10 print:p-0 justify-evenly gap-10'>
      <div className="no-print w-full">
        <Card className="max-w-2/3">

          <div className="mb-4 ms:w-80 mx-auto">
            <h5 className="text-xl text-center mb-4 font-bold leading-none text-gray-900 dark:text-white">Tibet Momo</h5>
            <TextInput id="search" type="text" className='w-full' icon={HiOutlineSearch} value={search} onChange={onSearchHandle} placeholder="Search Menu" autoFocus sizing='sm' />
          </div>

          <div className="flow-root">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredList.map((list) => {
                return (
                  <li className="py-3 sm:py-4" key={list.id}>
                    <div className="flex items-center space-x-4">
                      <div className="shrink-0">
                      {list.img ? (
                        <img
                        alt="Neil image"
                        height="32"
                        src={list.img || ''}
                        width="32"
                        className="rounded-full"
                      />
                      ) : (
                        <div className='w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500'>
                          <FaUser />
                        </div>
                      )}
                      </div>
                      <div className="min-w-0 w-60">
                        <p className="truncate text-sm text-gray-900 dark:text-white font-semibold">{list.name}</p>
                      </div>
                      <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white flex-auto">{list.price}</div>
                      <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        
                        {list.isAdded ? (
                            <div className="flex items-center">
                              <Button size='xs' className='rounded-none rounded-l-md' onClick={()=>onDecrease(list)}>
                                <HiMinus className="h-4 w-4"/>
                              </Button>
                              <p className='font-normal px-2'>{list.qty}</p>
                              <Button size='xs' className='rounded-none rounded-r-md' onClick={()=>onIncrease(list)}>
                                <HiPlus className="h-4 w-4" />
                              </Button>
                            </div>
                        ) : (
                            <Button size='xs'  onClick={() =>onAdd(list)}>Add</Button> 
                        )}
                        

                        

                      </div>
                    </div>
                  </li>
                )
              })}
              
            </ul>
          </div>

          <div className="flex justify-between items-center">
            <div className='flex items-center gap-2'>
              <p className='font-bold'>Discount</p>
              <TextInput type='number' sizing='sm' className='w-16' min={'0'} max={'100'} value={discount} onChange={(event:any) => setDiscount(event?.target.value)} />
              <p className='font-bold'>%</p>
            </div>
              <Button
              color="blue"
              className="ml-auto my-2 float-right"
              onClick={() => window.print()}
            >
              Print
            </Button>
          </div>

          

        </Card>
      </div>

        {/* Print Template */}
      <div className="print-container nunito-regular text-slate-600 pr-5 md:w-1/3 print:w-full">
        <p className="flex items-center justify-center text-lg">
          <TbBrandHexo /> <TbHexagonLetterB />
        </p>
        <h1 className="text-center font-bold text-xl">Hexa Bees Ent.</h1>
        <h6 className="text-center font-semibold text-xs my-1">
          +91 637 924 1773
        </h6>
        <p className="text-center text-xs my-1">Bill Id: 234567</p>

        <div className="flex justify-between items-center p-2 border-dashed border-b-[2px] border-slate-400">
          <p className="text-xs">Date: {formattedDate}</p>
          <p className="text-xs">Time:{formattedTime}</p>
        </div>

        <table className="w-full p-2 border-b-[1px] border-dashed border-slate-400">
          <thead className="border-b-[1px] border-dashed border-slate-400 text-xs">
            <tr className="h-[30px]">
              <th>Item</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((menu) => (
              menu.qty > 0 ?
              (<tr key={menu.id}>
                <td className="h-[25px]">
                  <p className="truncate w-[120px] text-xs">{menu.name}</p>
                </td>
                <td className="text-center text-xs">{menu.price}</td>
                <td className="text-center text-xs">{menu.qty}</td>
                <td className="text-center text-xs">{menu.price * menu.qty}</td>
              </tr>) : ('')
            ))}
          </tbody>
        </table>

        <div className="flex flex-col items-end px-4 py-2 gap-2 border-b-2 border-dashed border-slate-400">
          <p className="text-xs flex items-center justify-end font-medium">SubTotal : <BiRupee/>{subTotal}</p>
          <p className="text-xs flex items-center justify-end font-medium">Discount : {discount}%</p>
        </div>

        <p className="font-bold text-sm flex items-center justify-end p-4">
          Total : <BiRupee /> {total}
        </p>

        <div className="border-y-[1px] border-dashed border-slate-400 py-4">
          <div className="flex items-center justify-center gap-2 text-slate-800 opacity-75 text-ms font-bold  h-[50px]">
            Save Paper!! Save Nature!! <ImLeaf />
          </div>
        </div>
      </div>
    </div>
  );
}
