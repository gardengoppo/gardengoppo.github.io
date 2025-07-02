export default function ProductCard({ product, onAdd, onView }) {
  const message = encodeURIComponent(
    `Hi, I'm interested in buying ${product.name} for ₹${product.price}.`
  );

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded p-4 flex flex-col">
      <img
        src={product.images?.[0]}
        alt={product.name}
        className="w-full h-48 object-cover rounded cursor-pointer"
        onClick={() => onView(product)}
      />
      <h3
        className="mt-2 font-semibold text-lg cursor-pointer hover:underline"
        onClick={() => onView(product)}
      >
        {product.name}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 flex-1">{product.description}</p>
      <p className="mt-2 font-bold text-green-700 dark:text-green-300">₹{product.price}</p>

      <div className="mt-4 flex flex-col gap-2">
        <button
          onClick={() => onAdd(product)}
          className="bg-green-600 hover:bg-green-700 text-white py-1 rounded"
        >
          Add to Cart
        </button>
        <a
          href={`https://wa.me/919000000000?text=${message}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white border border-green-600 text-green-700 hover:bg-green-50 dark:bg-gray-700 dark:text-green-300 dark:border-green-300 py-1 rounded text-center"
        >
          Buy on WhatsApp
        </a>
      </div>
    </div>
  );
}
