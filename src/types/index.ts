export interface Supplier {
  id: string;
  name: string;
  contact: string;
  address: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  supplier_id: string;
  supplier?: Supplier;
  created_at: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  prescription: string;
  created_at: string;
}

export interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Order {
  id: string;
  client_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  client?: Client;
  items?: OrderItem[];
}