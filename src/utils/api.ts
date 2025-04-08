import type { Product } from '../types/product';

const API_URL = 'https://raw.githubusercontent.com/xyzakaria/luxfood_/refs/heads/main/src/data/data.json';

export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const contentType = response.headers.get('content-type');
    

    const data = await response.json();
    
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      reference: item.reference,
      image: item.image,
      description: item.description || '',
      stock: item.stock || 0
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function fetchProductById(id: number): Promise<Product | null> {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid response format - expected JSON');
    }

    const data = await response.json();
    
    if (!data) {
      return null;
    }
    
    return {
      id: data.id,
      name: data.name,
      category: data.category,
      reference: data.reference.toString(),
      image: data.image,
      description: data.description || '',
      stock: data.stock || 0
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}