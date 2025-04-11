import type { Product } from '../types/product';

const API_CONFIG = {
  URL: "https://aliphia.com/v1/api_public/items/product",
  HEADERS: {
    "X-KEYALI-API": "ali_jp2BzembN6mzZIuPUo4QQRbUTNGRGdEEA1cv",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  },
  AUTH: "265152394062102:Fobv4bnl2JSPB9r"
};

const FALLBACK_IMAGE = 'https://raw.githubusercontent.com/xyzakaria/luxfood_/refs/heads/main/src/public/INA.jpg';

export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch(API_CONFIG.URL, {
      headers: {
        ...API_CONFIG.HEADERS,
        Authorization: `Basic ${btoa(API_CONFIG.AUTH)}`
      }
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();

    return data.map((item: any) => ({
      id: parseInt(item.item_lookup_custom_id) || 0,
      name: item.item_name || '',
      name_ar: item.articles_custom_namear || '',
      category: item.articles_custom_categorie || '',
      reference: item.item_codebar || '',
      image: item.item_image?.trim() || FALLBACK_IMAGE,
      description: item.item_description !== 'vide' ? item.item_description : '',
      description_ar: '', // Conservé pour la compatibilité
      stock: Math.max(0, parseInt(item.item_quantity)) || 0
    }));

  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// fetchProductById et fetchLatestProducts restent identiques à votre version originale