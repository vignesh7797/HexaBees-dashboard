'use client';
import { useMenuContext } from '../context/menuContext';
import { HiMinus, HiPlus } from 'react-icons/hi';
import { Button, Card, TextInput  } from 'flowbite-react';
import { BiRupee } from 'react-icons/bi';
import { ImLeaf, ImSpoonKnife } from 'react-icons/im';
import { useEffect, useState } from 'react';
import { HiOutlineSearch } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import { Menu } from '../common';
import Image from 'next/image';
import axios from 'axios';

interface BillMenu {
  id:number
  name:string
  category: string
  type ?: string
  quantity?:number
  price : number
  image ?:string
  isAdded ?:boolean
}


export default function Home() {
  const router = useRouter()
  const { menus } = useMenuContext();
  const [menuList, setMenuList] = useState<BillMenu[]>([])
  const [search, setSearch] = useState<string>('');
  const [total, setTotal] = useState<number>(0);
  const [subTotal, setSubTotal] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [billList, setBillList] = useState<BillMenu[]>([])
  const [message, setMessage] = useState('');
  const [lastId, setLastId] = useState<number>(0)

  const date = new Date();

  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const onSearchHandle = (event:React.ChangeEvent<HTMLInputElement>) =>{
    setSearch(event.target.value);
  }

  const onAdd = (menu:BillMenu) =>{
    setMenuList(list =>
      list.map(item => item.id == menu.id ? {...item, isAdded : true, quantity : 1} : item)
    );
    const newItem = menuList.find(list => list.id == menu.id);
    newItem.quantity = 1;
    setBillList((prevItems) => [...prevItems, newItem]);
    
  }

  const onIncrease = (menu:BillMenu) =>{
    setMenuList(list => 
      list.map(item => item.id == menu.id ? {...item, quantity:Number(menu.quantity) + 1, isAdded : true} : item)
    );

    const extItem = billList.find(list => list.id == menu.id);
   
    if(extItem){
      setBillList(list => 
        list.map(item => item.id == menu.id ? {...item, quantity : Number(item.quantity) + 1} : item)
      )
    }
  }

  const onDecrease = (menu:BillMenu) =>{
    setMenuList(list => 
      list.map(item => item.id == menu.id ? {...item, quantity : Number(menu.quantity) - 1, isAdded : Number(menu.quantity) > 1} : item)
    );
    
    const extItem = billList.find(list => list.id == menu.id);
   
    if(extItem && extItem.quantity > 1){
      setBillList(list => 
        list.map(item => item.id == menu.id ? {...item, quantity : Number(item.quantity) - 1} : item)
      )
    }else if(extItem.quantity == 1){
      setBillList((prevItems) => prevItems.filter((item) => Number(item.quantity) != 1));
    }
  }

  const onPrint = async() =>{

    try {
      const items: Menu[] = []
      
      billList.forEach(bill => {
        items.push({
          menu_id: bill.id,
          quantity: bill.quantity,
          price: bill.price,
          id: 0,
          name: bill.name,
          category: "",
          code : ""
        })
      })

      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_name: 'Cashier',
          items:items,
          discount : discount,
          date: new Date()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed toLowerCase() create order');
      }else{
        setBillList([]);
        setMenuList(list =>
          list.map(item => item.isAdded == true ? {...item, isAdded:false, quantity :0} : item)
        )
        getLastId();
      }

    } catch (error) {
      console.error('Error creating order:', error);
      setMessage('Failed toLowerCase() create order');
    }
    
    window.print();
  }

  const navigateToHistory = () => {
    if(message){
      router.push('/history');
    }
  }

  useEffect(() =>{
    if(menus.length > 0){
      getLastId();
      setMenuList(menus);
    }
  },[menus])

  useEffect(() =>{
    if(discount > 0){
      setTotal(Math.round(subTotal - (subTotal * (discount/100))))
    }else{
      setTotal(subTotal)
    }
  },[discount, subTotal])

  useEffect(()=>{
    // setBillList(menuList.filter(menu => menu.isAdded == true));
  }, [menuList])

  useEffect(()=>{
    let sub = 0;
    billList.map(bill => sub += bill.price * Number(bill.quantity));
    setSubTotal(sub);

    if(discount > 0){
      setTotal(Math.round(subTotal - (subTotal * (discount/100))))
    }else{
      setTotal(sub)
    }
  },[billList, discount, subTotal])

  useEffect(() =>{
    if (typeof window !== "undefined") {
      window.addEventListener("afterprint", () => {
        navigateToHistory()
      });
      return () => window.removeEventListener("resize", () => {});
    }
  })

  const getLastId = async() =>{
    const {data} = await axios.get('/api/order-id');
    console.log(data);
    setLastId(data.lastId)
  }

  return (
    <div className='flex flex-col md:flex-row print:flex-col w-screen md:p-10 print:p-0 justify-evenly gap-10'>

      <div className="no-print w-full">

        <Card className="md:max-w-2/3">

          <div className="mb-4 w-full mx-auto relative">
            <h5 className="text-xl text-center mb-4 font-bold leading-none text-gray-900 dark:text-white">Tibet Momo</h5>

            <div className="flex justify-between items-center">
              <div className='flex items-center gap-2'>
                <p className='font-bold text-sm'>Discount</p>
                <TextInput type='number' sizing='sm' className='w-12' min={'0'} max={'100'} value={discount} onChange={(event:React.ChangeEvent<HTMLInputElement>) => setDiscount(Number(event?.target.value) || 0)} />
                <p className='font-bold text-sm'>%</p>
              </div>
              
              <TextInput id="search" type="text" className='w-full md:w-80' icon={HiOutlineSearch} value={search} onChange={onSearchHandle} placeholder="Search Menu" autoFocus sizing='sm' />

              <Button
                color="blue"
                className=""
                size='sm'
                onClick={() => onPrint()}
                disabled={billList.length == 0}
              >
                Print
              </Button>
            </div>
          </div>

          <div className="flow-root">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {menuList.filter(menu => menu.name.toLowerCase().includes(search.toLowerCase())).map((list, ind) => {
                return (
                  <li className="py-3 sm:py-4" key={list.id+list.name+ind}>
                    <div className="flex items-center space-x-4">
                      <div className="shrink-0">
                      {list.image ? (
                        <Image
                        alt={list.name}
                        src={list.image || ''}
                        className="rounded-full h-10 w-10"
                        width={40}
                        height={40}
                        unoptimized
                      />
                      ) : (
                        <div className='w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600'>
                          <ImSpoonKnife />
                        </div>
                      )}
                      </div>
                      <div className="min-w-0 w-60">
                        <p className="truncate text-gray-900 dark:text-white font-bold text-base">{list.name} 
                          {list.category == 'Momo' && 
                          <span className='text-sm font-medium'>
                            {` (${list.type})`}
                          </span>
                          }
                        </p>
                      </div>
                      <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white flex-auto">{list.price}</div>
                      <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        
                        {list.isAdded ? (
                            <div className="flex items-center">
                              <Button size='xs' className='rounded-none rounded-l-md' onClick={()=>onDecrease(list)}>
                                <HiMinus className="h-4 w-4"/>
                              </Button>
                              <p className='font-normal px-2'>{list.quantity}</p>
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
              <TextInput type='number' sizing='sm' className='w-16' min={'0'} max={'100'} value={discount} onChange={(event:React.ChangeEvent<HTMLInputElement>) => setDiscount(Number(event?.target.value) || 0)} />
              <p className='font-bold'>%</p>
            </div>
            <Button
              color="blue"
              className="ml-auto my-2 float-right"
              onClick={() => onPrint()}
              disabled={billList.length == 0}
            >
              Print
            </Button>
          </div>

          

        </Card>
      </div>

        {/* Print Template */}
      <div className="print-container nunito-regular text-black pr-5 md:w-1/3 print:w-full">
        <p className="flex items-center justify-center text-lg">
          <Image src={'/logo-text-black.svg'} width={150} height={100} alt='Hexa Bees'></Image>
        </p>
        <h6 className="text-center font-semibold text-xs my-1">
          +91 637 924 1773
        </h6>
        <p className="text-center text-xs my-1">Bill Id: #{lastId + 1}</p>

        <div className="flex justify-between items-center p-2 border-dashed border-b-[2px] border-black">
          <p className="text-xs">Date: {formattedDate}</p>
          <p className="text-xs">Time: {formattedTime}</p>
        </div>

        <table className="w-full p-2 border-b-[1px] border-dashed border-black">
          <thead className="border-b-[1px] border-dashed border-black text-xs">
            <tr className="h-[30px]">
              <th>Item</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {billList.map((menu) => (
              Number(menu.quantity) > 0 ?
              (<tr key={menu.id}>
                <td className="h-[25px]">
                  <p className="truncate w-[120px] text-xs">{menu.name}</p>
                </td>
                <td className="text-center text-xs">{menu.price}</td>
                <td className="text-center text-xs">{menu.quantity}</td>
                <td className="text-center text-xs">{menu.price * Number(menu.quantity)}</td>
              </tr>) : ('')
            ))}
          </tbody>
        </table>

        <div className="flex flex-col items-end px-4 py-2 gap-2 border-b-2 border-dashed border-black">
          <p className="text-xs flex items-center justify-end font-medium">SubTotal : <BiRupee/>{subTotal | 0}</p>
          <p className="text-xs flex items-center justify-end font-medium">Discount : {discount}%</p>
        </div>

        <p className="font-bold text-sm flex items-center justify-end p-4">
          Total : <BiRupee /> {total}
        </p>

        <div className="border-y-[1px] border-dashed border-black py-4">
          <div className="flex items-center justify-center gap-2 text-black opacity-60 text-ms font-bold  h-[50px]">
            Save Paper!! Save Nature!! <ImLeaf />
          </div>
        </div>
      </div>

    </div>
  );
}
