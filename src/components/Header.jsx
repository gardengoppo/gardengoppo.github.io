export default function Header({ count, onCartClick }) {
  return (
    <header className="bg-gray-700 text-white px-4 py-2 flex justify-between items-center shadow">
      <img style={{height:'48px'}} src="/ggg.png" /> <h1 className="text-xl text-green-600 font-bold">Garden Goppo</h1>
      <div className="relative">
        <button onClick={onCartClick} className="relative">
          🛒
          {count > 0 && (
            <>
            <span>🌿</span> <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-1 rounded-full">
              {count}
            </span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}