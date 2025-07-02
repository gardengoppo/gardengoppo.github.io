export default function Header({ count, onCartClick }) {
  return (
    <header className="bg-green-700 text-white px-4 py-3 flex justify-between items-center shadow">
      <h1 className="text-xl font-bold">🌿 Garden Goppo</h1>
      <div className="relative">
        <button onClick={onCartClick} className="relative">
          🛒
          {count > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-1 rounded-full">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}