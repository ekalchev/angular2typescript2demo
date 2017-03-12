export class Address {
    street?: string;
    city?: string;
    state?: string;
    zip?: string; 
}

export class ShoppingBagItem {
    description: string;
    price: number;
}

export class ShoppingBag {
    items: ShoppingBagItem[];
}

export class CustomerFile {
    name: string;
    content: string;
}

export class Customer {
    id: number;
    firstName: string;
    lastName: string;
    address?: Address;
    birthDate: string;
    shoppingBag: ShoppingBag
    files?: CustomerFile[]
}