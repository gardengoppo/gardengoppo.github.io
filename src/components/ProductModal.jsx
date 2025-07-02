import { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function ProductModal({ product, onClose, onAdd }) {
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        onClose();
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [onClose]);

  const message = encodeURIComponent(
    `Hi, I'm interested in buying ${product.name} for ₹${product.price}.`
  );

  return (
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
          aria-label="Close"
        >
          &times;
        </button>

        {/* Swiper Carousel */}
        {product.images && product.images.length > 0 && (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: true }}
            className="mb-4 rounded overflow-hidden"
          >
            {product.images.map((img, idx) => (
              <SwiperSlide key={idx}>
                <img
                  src={img}
                  alt={`${product.name} ${idx + 1}`}
                  className="w-full h-64 object-cover rounded"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        <h2 className="text-2xl font-semibold text-green-700 dark:text-green-300 mb-2">
          {product.name}
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-2">{product.description}</p>
        <p className="font-bold text-green-900 dark:text-green-100 text-lg mb-4">
          ₹{product.price}
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => {
              onAdd(product);
              onClose();
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Add to Cart
          </button> 
          <a
            href={`https://wa.me/919062203601?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-green-600 text-green-700 hover:bg-green-50 dark:bg-gray-700 dark:text-green-300 dark:border-green-300 px-4 py-2 rounded"
          >
            Buy on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
