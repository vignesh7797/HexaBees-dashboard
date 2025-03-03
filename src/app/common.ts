export interface Menu {
    id : number
    name : string
    code : string
    category : string
    price : number
    type ?: string
    image ? :string
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
    id: number,
    customer_name: string,
    date: Date,
    discount: number,
    sub_total: number,
    total_amount: number,
    products: Menu[]
}

export interface TopSelling {
    name : string,
    total_quantity : number,
    total_price : number
}