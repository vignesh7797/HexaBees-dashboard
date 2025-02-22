export interface Menu {
    id : number
    name : string
    category : string
    price : number
    image ? :string
    quantity ?:number,
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