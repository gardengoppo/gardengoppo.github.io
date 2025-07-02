export default function CartModal({ cart, onClose }) {
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const cartMsg = encodeURIComponent(
    `Hi, I would like to buy these items:\n${cart
      .map(item => `${item.name} - ₹${item.price}`)
      .join('\n')}\nTotal: ₹${total}`
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-300">Cart</h2>

        {cart.length === 0 ? (
          <p className="text-sm">Your cart is empty.</p>
        ) : (
          <>
            <ul className="space-y-2">
              {cart.map((item, i) => (
                <li key={i} className="flex justify-between">
                  <span>{item.name}</span>
                  <span>₹{item.price}</span>
                </li>
              ))}
            </ul>

            <p className="mt-4 font-bold text-green-900 dark:text-green-100">Total: ₹{total}</p>

            <a
              href={`https://wa.me/916296489192?text=${cartMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-4 bg-green-600 text-white text-center py-2 rounded hover:bg-green-700"
            >
              Checkout on WhatsApp
            </a>
          </>
        )}

        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-500 dark:text-gray-400 underline"
        >
          Close
        </button>
      </div>
    </div>
  );
}
