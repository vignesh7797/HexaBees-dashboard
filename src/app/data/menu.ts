export interface Menu {
    id: number;
    name: string;
    code: number;
    type: "Steam" | "Fried" | null,
    varient: "veg" | "nonveg" | "egg",
    category: string,
    price: string,
    image?: string | null
  }