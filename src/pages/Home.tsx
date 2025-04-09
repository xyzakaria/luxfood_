import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRight, ImageOff, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import { fetchProducts, fetchLatestProducts } from '../utils/api';
import { useShoppingList } from '../contexts/ShoppingListContext';
import type { Product } from '../types/product';

const brands = [
  {
    name: "ABD DAIRY",
    logo: "https://lh3.googleusercontent.com/pw/AP1GczNyYsYCzFx9gSJzKEKaXNxql7uCU67iOI2y-0JoJTJq9pZNtieYONSUwZsxw_hmWnsfM4io2KFNaN_mVbSZK2UY66wPRYwmDqPFEjMfP-Z5rdS_6RLi_cu6qxcRxDRupA_HPnT9hZsa5SvftUMq7vkf=w406-h235-s-no-gm?authuser=6",
    source: "google"
  },
  {
    name: "Ahmad",
    logo: "https://lh3.googleusercontent.com/pw/AP1GczPKdv4wk1Ji4463WuNu78jWoHzd6_sv7VoHAprCNwVMEbforXHb6tPxlmadKpMkOhX73DaP5Cr2QVbIe0DmB6YuNQDBckGZR7so-hkf9szPlZVt_qG9XAKKCQr2XYLn9ThbmwVVUD3b-lziC1MDZjRA=w1200-h675-s-no-gm?authuser=6",
    source: "clearbit"
  },
  
  {
    name: "Al-Durra",
    logo: "https://lh3.googleusercontent.com/pw/AP1GczM0KX-_9Ro7GaZml1RFtW4lXFWZ4F48yreWXAv5LGWM3OrHgQ5Hxb7OULcraCmbb_rLoKg6Xt3SusTa-ChJAIBs-w6HNzofKoA3XLDX0zRwjWq4zqbTXYEaPWMIXq1Yx58BlUY-9EIrgtz5r9ZTx6f5=w500-h500-s-no-gm?authuser=6",
    source: "google"
  },
  {
    name: "Monte Verde",
    logo: "https://raw.githubusercontent.com/xyzakaria/luxfood_/refs/heads/main/src/public/pic_brand/image_monteverde.png",
    source: "google"
  },
  {
    name: "DERBY",
    logo: "https://raw.githubusercontent.com/xyzakaria/luxfood_/refs/heads/main/src/public/pic_brand/image_derby.png",
    source: "google"
  },
  {
    name: "HASEEB",
    logo: "https://raw.githubusercontent.com/xyzakaria/luxfood_/refs/heads/main/src/public/pic_brand/image_haseeb.png",
    source: "google"
  },
  {
    name: "CHTOURA",
    logo: "https://raw.githubusercontent.com/xyzakaria/luxfood_/refs/heads/main/src/public/pic_brand/image_chtoura.png",
    source: "google"
  },
  {
    name: "Al Sabah",
    logo: "https://scontent-cdg4-1.xx.fbcdn.net/v/t39.30808-6/468806796_122125816442526924_2303591284297268711_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=qCfVG5A4xLgQ7kNvgGMbIrT&_nc_oc=AdlUkH9O_SFyJveMhKOVxqxAt8LaSz4PvnznYGtxE1093TiYrne_1TUJ5AI3Y7CJzKM&_nc_zt=23&_nc_ht=scontent-cdg4-1.xx&_nc_gid=Hb51LsaSIcHThTyDEs3gJg&oh=00_AYExGtdSP_6OU49ZhyTpggqLfCS5q6fCuRSi4Vz5IdJiqQ&oe=67F22013",
    source: "google"
  },
  {
    name: "ZINE",
    logo: "https://cdn.discordapp.com/attachments/1356725042938908712/1356737379267907706/DELUXE_1KG-2.png?ex=67eda7a6&is=67ec5626&hm=42ce1168dfa1bae8ad38ee7b819d6716bb74cc450d76180796ea74f0cd457047&",
    source: "google"
  },
  {
    name: "Aseel",
    logo: "https://images-ext-1.discordapp.net/external/qBceHDyp5G7y1QJLmW_O1qQRiMfbGdf4pk8pw0HrHR4/%3Fq%3Dtbn%3AANd9GcSzFiM9FyEKdC3txnOWGrbYpWoX9gDFLJOUHQ%26s/https/encrypted-tbn0.gstatic.com/images?width=246&height=246",
    source: "google"
  },
  {
    name: "KHANUM",
    logo: "https://media.discordapp.net/attachments/1356725042938908712/1356738766898860214/408758374_122099825432073990_5237870278676429579_n.png?ex=67eda8f1&is=67ec5771&hm=dcd6380563ba4438f5e35cec3ec81b495f5610b4c074de8049435b0b324a25fe&=&width=519&height=519",
    source: "google"
  },
  {
    name: "ALSHALAN",
    logo: "https://cdn.discordapp.com/attachments/1356725042938908712/1356739913495871731/logo_meta.png?ex=67edaa02&is=67ec5882&hm=9ed579354b5db4952b9b0ebe3eb6236c790b52f5a5cb06238901d51d0b4ae759&",
    source: "google"
  },
  {
    name: "Rass El Hissan",
    logo: "https://cdn.discordapp.com/attachments/1356725042938908712/1356740873265746092/the-ras-alhissan.png?ex=67edaae7&is=67ec5967&hm=b10992127705c1d9f21d639e34aad2a959694f37cbbf6453b5514f9cc26b8a9a&",
    source: "google"
  },
  {
    name: "KHANUM",
    logo: "https://cdn.discordapp.com/attachments/1356725042938908712/1356741391929053184/alwazah-logoal.png?ex=67edab62&is=67ec59e2&hm=7d7ee9ab55e2b2acfc8eee6a91e05bf09905ef0207098283813df2331f9de9a3&",
    source: "google"
  },
];
export default function Home() {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { dispatch } = useShoppingList();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const [allProducts, latest] = await Promise.all([
          fetchProducts(),
          fetchLatestProducts()
        ]);
        setProducts(allProducts);
        setLatestProducts(latest);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleAddToList = useCallback((e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: 'ADD_ITEM', payload: product });
  }, [dispatch]);

  const renderProductImage = useCallback((product: Product, className: string) => {
    if (!product.image) {
      return (
        <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
          <ImageOff className="w-16 h-16 text-gray-400" />
        </div>
      );
    }

    // Add size parameters to image URLs for optimization
    const optimizedImageUrl = product.image.includes('unsplash.com') 
      ? `${product.image}?auto=format&fit=crop&w=500&q=80`
      : product.image;

    return (
      <img
        src={optimizedImageUrl}
        alt={i18n.language === 'ar' && product.name_ar ? product.name_ar : product.name}
        className={className}
        loading="lazy"
        decoding="async"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          target.parentElement?.classList.add('flex', 'items-center', 'justify-center', 'bg-gray-100');
          const fallback = document.createElement('div');
          fallback.className = 'w-16 h-16 text-gray-400';
          fallback.innerHTML = '<svg>...</svg>'; // ImageOff icon SVG
          target.parentElement?.appendChild(fallback);
        }}
      />
    );
  }, [i18n.language]);

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
          <img
            className="w-full h-[600px] object-cover"
            src="https://images.unsplash.com/photo-1495195134817-aeb325a55b65?auto=format&fit=crop&w=1920&q=80"
            alt="Food background"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gray-900 bg-opacity-50"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t('hero.title')}
          </h1>
          <p className="mt-6 text-xl text-white max-w-3xl">
            {t('hero.subtitle')}
          </p>
          <div className="mt-10">
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {t('nav.products')}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Products Slider */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
            Featured Products
          </h2>
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <Swiper
              modules={[Autoplay, EffectFade]}
              spaceBetween={30}
              slidesPerView={1}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              className="pb-8"
            >
              {products.map((product) => (
                <SwiperSlide key={product.id}>
                  <Link
                    to={`/products/${product.id}`}
                    className={`block ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={(e) => product.stock === 0 && e.preventDefault()}
                  >
                    <div className="bg-white rounded-lg overflow-hidden shadow-lg transform transition-transform duration-200 hover:scale-105">
                      {renderProductImage(product, 'w-full h-48 object-cover')}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {i18n.language === 'ar' && product.name_ar ? product.name_ar : product.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {t(`products.categories.${product.category}`)}
                        </p>
                        {product.stock > 0 && (
                          <button
                            onClick={(e) => handleAddToList(e, product)}
                            className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-700"
                          >
                            <ShoppingCart className="h-5 w-5 mr-2" />
                            Add to List
                          </button>
                        )}
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>

      {/* Latest Products Section with Virtualization */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
            Latest Products
          </h2>
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 gap-x-6">
              {latestProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className={`group ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={(e) => product.stock === 0 && e.preventDefault()}
                >
                  <div className="relative">
                    <div className="w-full h-64 bg-white rounded-2xl overflow-hidden shadow-lg transform transition-transform duration-200 group-hover:scale-105">
                      {renderProductImage(product, 'w-full h-full object-center object-cover')}
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">Out of Stock</span>
                        </div>
                      )}
                      {product.stock > 0 && (
                        <button
                          onClick={(e) => handleAddToList(e, product)}
                          className="absolute bottom-4 right-4 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                        >
                          <ShoppingCart className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {i18n.language === 'ar' && product.name_ar ? product.name_ar : product.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {t(`products.categories.${product.category}`)}
                      </p>
                      <p className={`mt-2 text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Brands Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
            Our Trusted Brands
          </h2>
          <Swiper
            modules={[Autoplay]}
            spaceBetween={30}
            slidesPerView={2}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
            }}
            className="pb-8"
          >
            {brands.map((brand, index) => (
              <SwiperSlide key={index}>
                <div className="bg-white rounded-lg p-6 shadow-md transform transition-transform duration-200 hover:scale-105">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-full h-32 object-cover rounded-lg"
                    loading="lazy"
                    decoding="async"
                  />
                  <p className="mt-4 text-center text-gray-800 font-medium">
                    {brand.name}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}