import { Customer, CustomerFile, ShoppingBag, ShoppingBagItem, Address } from './customer';

export const CUSTOMERS: Customer[] = [
    { id: 1, firstName: "John", lastName: "Smith", address: { street: "Broadway 11", city: "Dallas", state: "TX", zip: "75001" }, shoppingBag: new ShoppingBag(), files: [{ name: "Personal File 1", content: "Some content" }, { name: "Personal File 2", content: "Some content" } ] },
    { id: 2, firstName: "Barbara", lastName: "Johnes", address: { street: "Allen Street", city: "New York", state: "NY", zip: "45001" }, shoppingBag: new ShoppingBag(), files: [{ name: "Top Secret File 1", content: "Some content" }, { name: "Top Secret File 2", content: "Some content" }] },
    { id: 3, firstName: "Louis", lastName: "Smith", address: { street: "Broome Street", city: "Los Angeles", state: "CA", zip: "55001" }, shoppingBag: new ShoppingBag() },
    { id: 4, firstName: "James", lastName: "Michael", shoppingBag: new ShoppingBag() },
];