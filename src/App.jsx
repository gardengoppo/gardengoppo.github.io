import Header from './components/Header';
import ProductCard from './components/ProductCard';
import CartModal from './components/CartModal';
import ProductModal from "./components/ProductModal";
import Scene from './components/Scene';
import Loader from './components/Loader';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import PwaInstallPrompt from './components/PwaInstallPrompt'

//import products from './data/products.json';

import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';

import { Helmet } from 'react-helmet';

export default function App() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : prefersDark;
  });

  useEffect(() => {
  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch('/products.new.json?v=' + Date.now());
      const data = await res.json();
      setProducts(data);

      // Perform cart reconciliation here
      const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
      const reconciled = storedCart.map((item) => {
        const updatedProduct = data.find(p => p.id === item.id);
        if (updatedProduct) {
          if (updatedProduct.price !== item.price) {
            toast(`🛒 Price updated for ${item.name}`, { duration: 3000 });
          }
          return {
            ...updatedProduct,
            quantity: item.quantity,
          };
        } else {
          toast(`❌ ${item.name} is no longer available`, { duration: 3000 });
          return null;
        }
      }).filter(Boolean);

      setCart(reconciled);
      localStorage.setItem('cart', JSON.stringify(reconciled));
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }

  fetchProducts();
}, []);


  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('product');

    if (products.length > 0 && id) {
      const found = products.find((p) => String(p.id) === id);
      if (found) {
        setSelectedProduct(found);
      }
    }
  }, [products]);

  // ✅ Handle browser navigation (back/forward)
  useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('product');
      if (id) {
        const found = products.find((p) => String(p.id) === id);
        if (found) {
          setSelectedProduct(found);
        }
      } else {
        setSelectedProduct(null);
      }
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [products]);


  const addToCart = (product) => {
    const existingIndex = cart.findIndex((item) => item.id === product.id);
    let updatedCart;

    if (existingIndex !== -1) {
      // Already exists → increment quantity
      updatedCart = [...cart];
      updatedCart[existingIndex].quantity += 1;
    } else {
      // New item → add with quantity
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast.success(`${product.name} added!`, {
      duration: 2000,
      style: {
        background: '#22c55e',
        color: '#fff',
      }
    })
  };

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleProductView = (product) => {
    setSelectedProduct(product);
    const url = new URL(window.location);
    url.searchParams.set('product', product.id); // assuming `product.id` is unique
    window.history.pushState({}, '', url);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    const url = new URL(window.location);
    url.searchParams.delete('product');
    window.history.pushState({}, '', url);
  };

  return (
    <div className="relative min-h-screen bg-green-50 dark:bg-gray-900 dark:text-white flex flex-col">
      <Helmet>
        <title>Garden Goppo – Plant Store</title>
        <meta name="description" content="Buy plants and garden products from Garden Goppo. Beautiful flowers, greenery, and local delivery." />
        <link rel="canonical" href="https://gardengoppo.github.io/" />
        <meta property="og:title" content={selectedProduct ? selectedProduct.name : "Garden Goppo – Plant Store"} />
        <meta property="og:description" content={selectedProduct ? selectedProduct.description : "Buy plants and garden products from Garden Goppo."} />
        {selectedProduct && selectedProduct.images?.[0] && (
          <meta property="og:image" content={selectedProduct.images[0]} />
        )}
        <meta property="og:url" content={window.location.href} />
      </Helmet>
      <Header count={cart.reduce((sum, item) => sum + item.quantity, 0)} onCartClick={() => setCartOpen(true)} />
      <div className="absolute top-3 right-16 z-50">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-xl  text-gray-800 dark:text-white px-3 py-1 rounded"
          aria-label="Toggle Dark Mode"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
      {/* <Scene /> */}
      <main className="flex-1 flex flex-col">
        <div className="flex gap-2 px-4 pt-4 flex-wrap">
          {['All', 'Flowers', 'Fruits', 'Tools', 'Seeds', 'Cactus'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1 rounded border ${selectedCategory === cat
                ? 'bg-green-600 text-white'
                : 'bg-white dark:bg-gray-800 text-green-700 dark:text-green-300 border-green-600'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 flex-1">
            {products
              .filter((p) => selectedCategory === 'All' || p.category === selectedCategory)
              .map((p) => (
                <ProductCard key={p.id} product={p} onAdd={addToCart} onView={handleProductView} />
              ))}
          </div>
        )}

      </main>

      <Toaster position="bottom-center" />

      {cartOpen && (
        <CartModal
          cart={cart}
          onClose={() => setCartOpen(false)}
          onUpdate={updateCart}
        />
      )}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={closeProductModal}
          onAdd={addToCart}
        />
      )}
      <Footer />
      <ScrollToTop />
      <PwaInstallPrompt />
    </div>
  );
}