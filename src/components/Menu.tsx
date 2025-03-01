import type React from "react"
import type { MenuItem } from "../types"

interface MenuProps {
  addToCart: (item: MenuItem) => void
}

const menuItems: MenuItem[] = [
  { id: 1, name: "Burger", price: 10.99, image: "/placeholder.svg" },
  { id: 2, name: "Pizza", price: 12.99, image: "/placeholder.svg" },
  { id: 3, name: "Salad", price: 8.99, image: "/placeholder.svg" },
  { id: 4, name: "Pasta", price: 11.99, image: "/placeholder.svg" },
]

const Menu: React.FC<MenuProps> = ({ addToCart }) => {
  return (
    <div className="flex-1">
      <h2 className="text-2xl font-semibold mb-4">Menu</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-gray-600">${item.price.toFixed(2)}</p>
              <button
                onClick={() => addToCart(item)}
                className="mt-2 w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Menu

