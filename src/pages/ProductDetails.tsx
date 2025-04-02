import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ImageOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { fetchProductById } from '../utils/api';
import type { Product } from '../types/product';

export default function ProductDetails() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await fetchProductById(parseInt(id));
        if (data) {
          setProduct(data);
          setError(null);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Failed to load product details');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Products
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0 md:w-1/2 relative">
              {!imageError && product.image ? (
                <img
                  className="h-96 w-full object-cover md:h-full"
                  src={product.image}
                  alt={i18n.language === 'ar' && product.name_ar ? product.name_ar : product.name}
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="h-96 w-full md:h-full flex items-center justify-center bg-gray-100">
                  <ImageOff className="w-24 h-24 text-gray-400" />
                </div>
              )}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-semibold text-xl">Out of Stock</span>
                </div>
              )}
            </div>
            <div className="p-8 md:p-12 md:w-1/2">
              <div className="uppercase tracking-wide text-sm text-indigo-600 font-semibold">
                {t(`products.categories.${product.category}`)}
              </div>
              <h1 className="mt-2 text-3xl font-extrabold text-gray-900">
                {i18n.language === 'ar' && product.name_ar ? product.name_ar : product.name}
              </h1>
              <p className="mt-4 text-gray-600 font-medium">
                Reference: REF-{product.reference}
              </p>
              <div className="mt-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                </span>
              </div>
              <div className="mt-6 prose prose-indigo">
                <p className="text-gray-700 leading-relaxed">
                  {i18n.language === 'ar' && product.description_ar 
                    ? product.description_ar 
                    : (product.description || 'No description available.')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}