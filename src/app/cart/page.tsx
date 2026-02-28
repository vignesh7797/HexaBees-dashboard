"use client"
import { useEffect, useState } from "react";
import { BiRupee } from "react-icons/bi";
import { FaPlus, FaMinus, FaArrowLeft } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { BillMenu, Menu } from "../common";
import Image from "next/image";
import Link from "next/link";
import { IoImageOutline } from "react-icons/io5";


export default function CartPage() {
    const router = useRouter();
    
    const [cartItems, setCartItems] = useState<BillMenu[]>([]);
    const [subTotal, setSubTotal] = useState(0);
    const [total, setTotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Try to get cart items from sessionStorage
        const savedCart = sessionStorage.getItem('cart');
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                setCartItems(parsedCart);
            } catch (error) {
                console.error('Error parsing saved cart:', error);
            }
        }


    },[])


    useEffect(() => {
        let total = 0;
        cartItems.forEach(item => {
            total += item.price * item.quantity;
        });
        setSubTotal(total);
        if (discount) {
            setTotal(Number((total - ((discount / 100) * total)).toFixed(2)));
        } else {
            setTotal(total);
        }
    }, [cartItems, discount]);

    function onIncrease(menu: BillMenu) {
        // Update cart items
        const updatedCartItems = cartItems.map(item => {
            if (item.id === menu.id) {
                return { ...item, quantity: item.quantity + 1 };
            }
            return item;
        });
        setCartItems(updatedCartItems);
        
        sessionStorage.setItem('cart', JSON.stringify(updatedCartItems.filter(item => item.isAdded)));
    }

    function onDecrease(menu: BillMenu) {
        if (menu.quantity > 1) {
            
            const updatedMenuList = cartItems.map(item => {
                if (item.id === menu.id) {
                    return { ...item, quantity: Number(item.quantity) - 1 };
                }
                return item;
            });
            
            setCartItems(updatedMenuList.filter(item => item.isAdded));
            sessionStorage.setItem('cart', JSON.stringify(updatedMenuList.filter(item => item.isAdded)));
        } else {
            const updatedMenuList = cartItems.map(item => {
                if(item.id === menu.id){
                    return { ...item, quantity: 0, isAdded: false };
                } 
                return item;
            });
            sessionStorage.setItem('cart', JSON.stringify(updatedMenuList));
            setCartItems(updatedMenuList.filter(menu => menu.isAdded));
        }
    }



    async function proceedToCheckout() {

        try{
            setLoading(true);
            const billList: Menu[] = cartItems.filter(menu => menu.isAdded).map(itm => { return { ...itm, id: 0, menu_id: itm.id, price: Number(itm.price) } });

            const response = await fetch('api/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    customer_name: 'Cashier',
                    items: billList,
                    discount: discount,
                    date: new Date()
                })
            });

            if (!response.ok) {
                alert('Internal Error. Print after sometimes')
            } else {
                setDiscount(0);
                setCartItems(list => list.map(item => item.isAdded ? { ...item, isAdded: false, quantity: 0 } : item));
                setSubTotal(0);
                setTotal(0);
                sessionStorage.setItem('cart', JSON.stringify([]));
                router.push('/billing');
            }
            setLoading(false);

        } catch (error) {
            console.error('Error creating order:', error);
            alert('Internal Error. Print after sometimes');
            setLoading(false)
        }
        
    }

    return (
        <div className="container mx-auto p-4 min-h-screen bg-gray-50">
            <div className="flex items-center mb-6">
                <Link href="/billing"
                    className="mr-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                >
                    <FaArrowLeft className="text-gray-700" />
                </Link>
                <h1 className="text-xl font-adlm text-gray-800">Back to Billing</h1>
            </div>

            {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64">
                    <div className="text-center mb-6">
                        <p className="text-xl font-adlm text-gray-700 mb-2">Your cart is empty</p>
                        <p className="text-gray-500">Add items from the menu to get started</p>
                    </div>
                    <Link href="/billing" 
                        className="btn-primary px-6 py-2"
                    >
                        Browse Menu
                    </Link>
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-lg shadow-md py-4 mb-6">
                        <h2 className="text-lg font-adlm mb-4 text-gray-800 px-4">Cart Items ({cartItems.length})</h2>
                        
                        <div className="space-y-4 max-h-[45vh] overflow-auto px-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex items-center border-b pb-4">
                                    <div className="w-14 h-14 relative rounded-lg overflow-hidden mr-4">
                                        {item.image ? (
                                            <Image 
                                                src={item.image} 
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                <span className="text-gray-600">
                                                    <IoImageOutline />
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex-1">
                                        <h3 className="font-adlm text-gray-800">{item.name}</h3>
                                        <p className="text-gray-600 text-sm">
                                            {item.type && (
                                                 <span>{item.type} - </span>
                                            )}
                                            <span className="text-gray-600 text-sm font-adlm"> {item.category}</span>
                                        </p>
                                        
                                        <div className="flex items-center mt-2">
                                            <span className="flex items-center text-primary font-adlm">
                                                <BiRupee /> {item.price}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center">
                                        <button 
                                            onClick={() => onDecrease(item)}
                                            className="w-8 h-8 p-1 rounded-full bg-gray-100 flex items-center justify-center"
                                        >
                                            <FaMinus className="text-primary text-xs" />
                                        </button>
                                        
                                        <span className="mx-3 font-adlm w-6 text-center">
                                            {item.quantity}
                                        </span>
                                        
                                        <button 
                                            onClick={() => onIncrease(item)}
                                            className="w-8 h-8 p-1 rounded-full bg-primary flex items-center justify-center"
                                        >
                                            <FaPlus className="text-white text-xs" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <h2 className="text-lg font-adlm mb-4 text-gray-800">Order Summary</h2>
                        
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-adlm flex items-center">
                                    <BiRupee /> {subTotal}
                                </span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Discount</span>
                                <div className="flex items-center">
                                    <input 
                                        type="number" 
                                        value={discount}
                                        min={0}
                                        max={100}
                                        onChange={(e) => setDiscount(Number(e.target.value))}
                                        className="w-16 bg-gray-50 border border-gray-200 rounded text-sm p-1 focus:ring-primary focus:border-primary"
                                    />
                                    <span className="ml-1">%</span>
                                </div>
                            </div>
                            
                            <div className="border-t pt-3 mt-3">
                                <div className="flex justify-between font-adlm">
                                    <span className="text-gray-800 text-lg">Total</span>
                                    <span className="text-primary text-xl flex items-center">
                                        <BiRupee className="text-xl" /> {total}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <button 
                            onClick={proceedToCheckout}
                            className="w-full btn-primary mt-6 text-center font-adlm"
                            disabled={cartItems.length === 0}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </>
            )}

            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
                    <div className="dot-loading">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            )}

        </div>
    );
}
