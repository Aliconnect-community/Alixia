"use client"

export default function ProductCard({ product, darkMode, onClick }) {
  return (
    <div
      className={`border rounded-lg overflow-hidden cursor-pointer transition-shadow hover:shadow-md ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
      onClick={() => onClick(product)}
    >
      <div className="h-40 overflow-hidden">
        <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-3">
        <h3 className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>{product.name}</h3>
        <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>${product.price.toFixed(2)}</p>
      </div>
    </div>
  )
}

