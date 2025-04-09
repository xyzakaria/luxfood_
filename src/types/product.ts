export interface Product {
  id: number;
  category: string;
  image: string;
  reference: string;
  name: string;
  name_ar?: string;
  description?: string;
  description_ar?: string;
  stock: number;
}