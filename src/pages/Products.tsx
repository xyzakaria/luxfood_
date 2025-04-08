import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, ImageOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../utils/api';
import type { Product } from '../types/product';

export default function Products() {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const data = await fetchProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t(`products.categories.${product.category}`).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.name_ar && i18n.language === 'ar' && product.name_ar.includes(searchQuery)) ||
      (product.reference.includes(searchQuery))
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products, t, i18n.language]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-8">
            {t('products.title')}
          </h2>
          
          <div className="max-w-xl mx-auto mb-12">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/products`}
              className={`group ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={(e) => product.stock === 0 && e.preventDefault()}
            >
              <div className="relative">
                <div className="w-full h-80 bg-white rounded-2xl overflow-hidden shadow-lg transform transition-transform duration-200 group-hover:scale-105">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={i18n.language === 'ar' && product.name_ar ? product.name_ar : product.name}
                      className="w-full h-full object-center object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement?.classList.add('flex', 'items-center', 'justify-center', 'bg-gray-100');
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <ImageOff className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">Out of Stock</span>
                    </div>
                  )}
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {i18n.language === 'ar' && product.name_ar ? product.name_ar : product.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {t(`products.categories.${product.category}`)}
                  </p>
                  <p className="mt-2 text-lg font-medium text-gray-600">
                    REF-{product.reference}
                  </p>
                  <p className={`mt-2 text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center mt-12">
            <p className="text-lg text-gray-500">
              No products found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}