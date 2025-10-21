export interface Tea {
    id: number;
    name: string;
    type: string;
    form: string;
    rawMaterial: string;
    aging: string;
    color: string;
    bouquet: string;
    aftertaste: string;
    price: number;
    imageUrl: string;
}

export interface TeaCategory {
    name: string;
    teas: Tea[];
    imageUrl: string;
}

export interface CartItem extends Tea {
    quantity: number;
}
