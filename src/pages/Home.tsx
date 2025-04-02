import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import { fetchProducts } from '../utils/api';
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
    logo: "https://media.discordapp.net/attachments/1356725042938908712/1356730048748589239/AP1GczPVqG81M6vyUj70MrLVw3notA4Lc1GOdZ3foUYxr5cLCTMWPtR5L1wbPxFTrbTAmoE6zMW_XfoQU7NezP12ZiiJzZqnzFBgMlB3XWHBFZUKEdATrXpboUayi2Ui32hYcAadIFOIKUfGpRdSQ57IIb2zw1005-h1012-s-no-gm.png?ex=67eda0d2&is=67ec4f52&hm=e9a1195f0d3249fd13cbd05197fdd45c075d0e70fb0a49fe7672266230ced49c&=&width=637&height=641",
    source: "google"
  },
  {
    name: "DERBY",
    logo: "https://cdn.discordapp.com/attachments/1356725042938908712/1356731033566838994/AP1GczMdzhLfq_1HbuDl5IA8TZNJlnwIRBqG_IOM37kLywjFHCKFolPSafJMPqSTzYlf6fTbp3utUGZbIxs-yb_rc7uBUNW0Nenau_CteS7XcDTYgBAEoSXXOBWVqcuZfRviVT736neUH8peVoFshWFZWeesw822-h701-s-no-gm.png?ex=67eda1bd&is=67ec503d&hm=e89e75b62389b21b53e66ebfb755964ccacc9d5bd1758b0306ae6e53ab348cc0&",
    source: "google"
  },
  {
    name: "HASEEB",
    logo: "https://cdn.discordapp.com/attachments/1356725042938908712/1356730898715902204/AP1GczORU1qLTX5wsZWW8N0MyKr8CpvJp_19sqf_VAJ5oI6OlMYgbiyfuPhlIiFY7rhh1O00RkpEZuk_G4_FrvkbF7HZbBTF89jEsgENCA22LH84AtE22IQxxtZSfkjoz5oDZesFd4H17-yzbi2o4E-Fv18vw556-h556-s-no-gm.png?ex=67eda19d&is=67ec501d&hm=fcbf2a7c6ea1e4589a6e6e8d241e8d7438d029bbd6d31fa546a60257c5a45bd1&",
    source: "google"
  },
  {
    name: "CHTOURA",
    logo: "https://cdn.discordapp.com/attachments/1356725042938908712/1356733585507483659/Brands-01.png?ex=67eda41d&is=67ec529d&hm=ac3cd2e969e6cbe584f25fdd1afca37d1237129a0077fbb87e14465f7c7112e3&",
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
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
          <img
            className="w-full h-[600px] object-cover"
            src="https://images.unsplash.com/photo-1495195134817-aeb325a55b65?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Food background"
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
            <a
              href="/products"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700" // pk ca marche pas?
            >
              {t('nav.products')}
              <ChevronRight className="ml-2 h-5 w-5" />
            </a>
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
              modules={[Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              autoplay={{ delay: 3000 }}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              className="pb-8"
            >
              {products.map((product) => (
                <SwiperSlide key={product.id}>
                  <div className="bg-white rounded-lg overflow-hidden shadow-lg transform transition-transform duration-200 hover:scale-105">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                      <p className="mt-2 text-gray-600 font-medium">{product.reference}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>

      {/* Brands Slider */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
            Our Trusted Brands
          </h2>
          <Swiper
            modules={[Autoplay]}
            spaceBetween={30}
            slidesPerView={2}
            autoplay={{ delay: 2500 }}
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