import { HiChartBar } from "react-icons/hi2";
import { MdMenuBook } from "react-icons/md";
import { FaReceipt, FaUsers } from "react-icons/fa";
import { AiFillPieChart } from "react-icons/ai";
import { RiFilePaper2Fill } from "react-icons/ri";
export interface Menu {
    id : number
    name : string
    code : string
    category : string
    price : number
    type ?: string
    varient? : 'veg' | 'nonveg' | 'egg';
    image ? : string
    imageFile ?: File
    quantity ?:number
    isAdded ? : boolean
    menu_id ? :number
}
export interface Order {
    id : number
    menu_id : number
    order_id : string
    price : number
    quantity :number,
}

export interface Bill {
    id?: number,
    customer_name?: string,
    date: Date | string,
    discount: number,
    sub_total: number,
    total_amount: number,
    products: Menu[]
}

export interface TopSelling {
    id : number,
    name : string,
    code : string,
    category : string
    price : number,
    total_quantity : number,
    total_price : number
    image ? :string,
    type ? : string,
}

export interface Banner {
    todaysOrders : number
    todaysRevenue : number
    totalOrders : number
    totalRevenue : number
    averageRevenue : number
}

export interface BillMenu {
    id:number
    name:string
    code : string
    category: string
    type ?: string
    quantity?:number
    price : number
    image ?:string
    isAdded ?:boolean
  }


export const sideMenus = [
    {label : 'Dashboard', link : '/', icon : HiChartBar},
    {label : 'Employees', link : '/employees', icon : FaUsers},
    {label : 'Menus', link : '/menus', icon : MdMenuBook},
    {label : 'Billing', link : '/billing', icon : FaReceipt},
    {label : 'History', link : '/history', icon : RiFilePaper2Fill},
    {label : 'Charts', link : '/charts', icon : AiFillPieChart},
]

export const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export const sortByList = [
    {label:'Recently Added', param : 'recent'},
    {label:'Low Price - High Price', param : 'low'},
    {label:'High Price - Low Price', param : 'high'},
    {label:'Order by A-Z', param : 'asc'},
    {label:'Order by Z-A', param : 'desc'}

]