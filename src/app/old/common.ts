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

export const OrangeShades = [
    'oklch(26.6% 0.079 36.259)',
    'oklch(40.8% 0.123 38.172)',
    'oklch(47% 0.157 37.304)',
    'oklch(55.3% 0.195 38.402)',
    'oklch(64.6% 0.222 41.116)',
    'oklch(70.5% 0.213 47.604)',
    'oklch(75% 0.183 55.934)',
    'oklch(83.7% 0.128 66.29)',
    'oklch(90.1% 0.076 70.697)',
    'oklch(95.4% 0.038 75.164)'
]

export const YellowShades = [
    'oklch(28.6% 0.066 53.813)',
    'oklch(42.1% 0.095 57.708)',
    'oklch(47.6% 0.114 61.907)',
    'oklch(55.4% 0.135 66.442)',
    'oklch(68.1% 0.162 75.834)',
    'oklch(79.5% 0.184 86.047)',
    'oklch(85.2% 0.199 91.936)',
    'oklch(90.5% 0.182 98.111)',
    'oklch(94.5% 0.129 101.54)',
    'oklch(97.3% 0.071 103.193)'
]

export const GreenShades = [
    'oklch(26.6% 0.065 152.934)',
    'oklch(39.3% 0.095 152.535)',
    'oklch(44.8% 0.119 151.328)',
    'oklch(52.7% 0.154 150.069)',
    'oklch(62.7% 0.194 149.214)',
    'oklch(72.3% 0.219 149.579)',
    'oklch(79.2% 0.209 151.711)',
    'oklch(87.1% 0.15 154.449)',
    'oklch(92.5% 0.084 155.995)',
    'oklch(96.2% 0.044 156.743)'
]

export const generalPalette = [
    '#4E79A7', // blue
    '#F28E2B', // orange
    '#E15759', // red
    '#76B7B2', // teal
    '#59A14F', // green
    '#EDC948', // yellow
    '#B07AA1', // purple
    '#FF9DA7', // pink
    '#9C755F', // brown
    '#BAB0AC', // gray
    '#FF5A1F', // orange
    '#F2F0F7',
    '#DADAEB',
    '#BCBDDC',
    '#9E9AC8',
    '#807DBA',
    '#6A51A3',
    '#54278F',
    '#3F007D',
    'oklch(57.7% 0.245 27.325)',
    'oklch(70.5% 0.213 47.604)',
    'oklch(76.9% 0.188 70.08)',
    'oklch(79.5% 0.184 86.047)',
    'oklch(76.8% 0.233 130.85)',
    'oklch(72.3% 0.219 149.579)',
    'oklch(69.6% 0.17 162.48)',
    'oklch(70.4% 0.14 182.503)',
    'oklch(71.5% 0.143 215.221)',
    'oklch(68.5% 0.169 237.323)',
    'oklch(62.3% 0.214 259.815)',
    'oklch(58.5% 0.233 277.117)',
    'oklch(60.6% 0.25 292.717)',
    'oklch(62.7% 0.265 303.9)',
    'oklch(66.7% 0.295 322.15)',
    'oklch(65.6% 0.241 354.308)',
    'oklch(64.5% 0.246 16.439)',
    'oklch(55.4% 0.046 257.417)',
    'oklch(55.1% 0.027 264.364)',
    'oklch(55.2% 0.016 285.938)',
    'oklch(55.6% 0 0)',
    'oklch(55.3% 0.013 58.071)'
]

export const sequentialPalette = [
    '#F2F0F7',
    '#DADAEB',
    '#BCBDDC',
    '#9E9AC8',
    '#807DBA',
    '#6A51A3',
    '#54278F',
    '#3F007D'
];

export const divergingPalette = [
    '#B2182B', // strong negative
    '#D6604D',
    '#F4A582',
    '#FDDBC7',
    '#F7F7F7', // neutral
    '#D1E5F0',
    '#92C5DE',
    '#4393C3',
    '#2166AC'  // strong positive
];

export const monoGrayPalette = [
    '#111827', // dark
    '#374151',
    '#6B7280',
    '#9CA3AF',
    '#D1D5DB',
    '#E5E7EB',
    '#F3F4F6'  // light
];

export const orangeSequential = [
    '#5F230D',  // darkest
    '#802F11',
    '#A13A15',
    '#C14519',
    '#E04F1C',
    '#FF5A1F', // base color
    '#FF8655',
    '#FFAB8A',
    '#FFD1BF',
    '#FFEDE6', // very light
  ];