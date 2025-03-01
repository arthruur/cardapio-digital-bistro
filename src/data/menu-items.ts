import type { MenuItem } from "@/types/menu"

export const menuItems: MenuItem[] = [
  // Starters
  {
    id: 1,
    name: "Bruschetta",
    description: "Toasted bread topped with tomatoes, garlic, and fresh basil",
    price: 8.95,
    category: "starters",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 2,
    name: "Arancini",
    description: "Crispy fried rice balls stuffed with mozzarella and peas",
    price: 9.95,
    category: "starters",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 3,
    name: "Caprese Salad",
    description: "Fresh mozzarella, tomatoes, and basil drizzled with balsamic glaze",
    price: 10.95,
    category: "starters",
    image: "/placeholder.svg?height=200&width=400",
  },

  // Main Courses
  {
    id: 4,
    name: "Bistro Burger",
    description: "Angus beef patty with caramelized onions, aged cheddar, and truffle aioli",
    price: 16.95,
    category: "mains",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 5,
    name: "Coq au Vin",
    description: "Classic French chicken braised with wine, mushrooms, and pearl onions",
    price: 22.95,
    category: "mains",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 6,
    name: "Mushroom Risotto",
    description: "Creamy arborio rice with wild mushrooms and parmesan",
    price: 18.95,
    category: "mains",
    image: "/placeholder.svg?height=200&width=400",
  },

  // Desserts
  {
    id: 7,
    name: "Crème Brûlée",
    description: "Classic vanilla custard with a caramelized sugar crust",
    price: 8.95,
    category: "desserts",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 8,
    name: "Chocolate Fondant",
    description: "Warm chocolate cake with a molten center, served with vanilla ice cream",
    price: 9.95,
    category: "desserts",
    image: "/placeholder.svg?height=200&width=400",
  },

  // Drinks
  {
    id: 9,
    name: "French Press Coffee",
    description: "Locally roasted organic coffee",
    price: 4.95,
    category: "drinks",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 10,
    name: "Sparkling Water",
    description: "San Pellegrino (500ml)",
    price: 3.95,
    category: "drinks",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 11,
    name: "House Red Wine",
    description: "Glass of our signature Cabernet Sauvignon",
    price: 8.95,
    category: "drinks",
    image: "/placeholder.svg?height=200&width=400",
  },
]

