import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRight, ImageOff, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import { fetchProducts, fetchLatestProducts } from '../utils/api';
import { useShoppingList } from '../contexts/ShoppingListContext';
import type { Product } from '../types/product';

const brands = [
  {
    name: "ABD DAIRY",
    logo: "https://raw.githubusercontent.com/xyzakaria/luxfood_/refs/heads/main/src/public/pic_brand/image_abd.png",
    source: "google"
  },
  {
    name: "Ahmad",
    logo: "https://raw.githubusercontent.com/xyzakaria/luxfood_/refs/heads/main/src/public/pic_brand/image_ahmad.png",
    source: "clearbit"
  },
  
  {
    name: "Al-Durra",
    logo: "https://raw.githubusercontent.com/xyzakaria/luxfood_/refs/heads/main/src/public/pic_brand/image_durra.png",
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
    logo: "https://raw.githubusercontent.com/xyzakaria/luxfood_/refs/heads/main/src/public/pic_brand/image_sabah.png",
    source: "google"
  },
  {
    name: "Aseel",
    logo: "https://raw.githubusercontent.com/xyzakaria/luxfood_/refs/heads/main/src/public/pic_brand/image_aseel.png",
    source: "google"
  },
  {
    name: "ALSHALAN",
    logo: "https://raw.githubusercontent.com/xyzakaria/luxfood_/refs/heads/main/src/public/pic_brand/image_zine_alsham.png",
    source: "google"
  },
  {
    name: "Rass El Hissan",
    logo: "https://raw.githubusercontent.com/xyzakaria/luxfood_/refs/heads/main/src/public/pic_brand/image_ras_hissan.png",
    source: "google"
  },
  {
    name: "KHANUM",
    logo: "https://raw.githubusercontent.com/xyzakaria/luxfood_/refs/heads/main/src/public/pic_brand/image_Khanum.png",
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
            className="w-full h-[458px] object-cover"
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
      {/* nul */}
      {/* Promotional Slideshow Section */}
<div className="relative w-full bg-gray-100 py-8">
  <Swiper
    modules={[Autoplay, Navigation, EffectFade]}
    effect="fade"
    speed={800}
    autoplay={{ delay: 5000, disableOnInteraction: false }}
    navigation={{
      nextEl: '.promo-next',
      prevEl: '.promo-prev',
    }}
    loop={true}
    className="promo-swiper h-96 w-full"
  >
    {/* Slide 1 - Seasonal Sale */}
    <SwiperSlide>
      <div className="relative h-full w-full">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80"
          alt="Seasonal Sale"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center">
          <div className="max-w-7xl mx-auto px-4 text-white text-center md:text-left">
            <span className="bg-indigo-600 text-sm px-4 py-1 rounded-full mb-4 inline-block">
              Limited Time Offer
            </span>
            <h2 className="text-4xl font-bold mb-4 drop-shadow-md">
              Summer Sale Up to 50% Off
            </h2>
            <p className="text-xl mb-8 max-w-2xl drop-shadow-md">
              Refresh your pantry with our best deals on seasonal products. 
              Offer valid until August 31st.
            </p>
            <Link
              to="/sales"
              className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-100 transition-colors"
            >
              Shop Now
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </SwiperSlide>

    {/* Slide 2 - New Arrivals */}
    <SwiperSlide>
      <div className="relative h-full w-full">
        <img
          src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1920&q=80"
          alt="New Arrivals"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-emerald-900/70 flex items-center">
          <div className="max-w-7xl mx-auto px-4 text-white text-center md:text-right">
            <span className="bg-emerald-500 text-sm px-4 py-1 rounded-full mb-4 inline-block">
              Just Launched
            </span>
            <h2 className="text-4xl font-bold mb-4 drop-shadow-md">
              Discover New Arrivals
            </h2>
            <p className="text-xl mb-8 max-w-2xl ml-auto drop-shadow-md">
              Explore our latest collection of international gourmet foods 
              and exclusive imports.
            </p>
            <Link
              to="/new-arrivals"
              className="inline-flex items-center px-6 py-3 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-emerald-100 transition-colors"
            >
              Explore New Products
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </SwiperSlide>

    {/* Slide 3 - Special Promotion */}
    <SwiperSlide>
      <div className="relative h-full w-full bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-white text-center w-full">
            <div className="text-5xl font-bold mb-6">Weekend Special!</div>
            <div className="text-3xl mb-8">
              Buy 1 Get 1 Free on Selected Items
            </div>
            <div className="flex justify-center gap-4">
              <Link
                to="/promotions"
                className="px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
              >
                View Deals
              </Link>
              <Link
                to="/membership"
                className="px-8 py-3 border-2 border-white rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-all"
              >
                Join Membership
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SwiperSlide>

    {/* Navigation Arrows */}
    <div className="absolute top-1/2 z-10 w-full px-4 transform -translate-y-1/2 flex justify-between pointer-events-none">
      <button
        aria-label="Previous slide"
        className="promo-prev bg-white/30 hover:bg-white/50 text-white p-3 rounded-full cursor-pointer pointer-events-auto transition-colors shadow-lg"
      >
        ❮
      </button>
      <button
        aria-label="Next slide"
        className="promo-next bg-white/30 hover:bg-white/50 text-white p-3 rounded-full cursor-pointer pointer-events-auto transition-colors shadow-lg"
      >
        ❯
      </button>
    </div>

    {/* Pagination */}
    <div className="swiper-pagination !bottom-4 [--swiper-pagination-color:theme(colors.indigo.600)]" />
  </Swiper>

  {/* Special Event Banner */}
  <div className="max-w-7xl mx-auto px-4 mt-8">
    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-4">
        <div className="bg-white/20 p-3 rounded-full">
          <ShoppingCart className="h-8 w-8" />
        </div>
        <div>
          <h3 className="text-xl font-bold">Flash Sale Ongoing!</h3>
          <p className="text-sm opacity-90">Daily deals ending at midnight</p>
        </div>
      </div>
      <Link
        to="/flash-sale"
        className="px-6 py-2 bg-white text-amber-600 rounded-full font-semibold flex items-center gap-2 hover:bg-amber-50 transition-colors"
      >
        Shop Now <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  </div>
</div>
  <div className="w-full bg-indigo-600 text-white p-4 text-center font-bold rounded-lg mb-8 shadow-md">
    🎉 Special Event: Join us for this weekend!
  </div>


      {/* Featured Products Slider */}
      <div className="bg-white  py-16">
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