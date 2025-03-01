import type { MenuItem } from "@/types/menu"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { menuItems } from "@/data/menu-items"

interface CategoryMenuProps {
  category: string
  addToCart: (item: MenuItem) => void
}

export default function CategoryMenu({ category, addToCart }: CategoryMenuProps) {
  const items = menuItems.filter((item) => item.category === category)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden bg-[#FFFCF7] border-[#FFDE68]">
          <div className="aspect-video w-full overflow-hidden bg-[#FFDE68]">
            <img
              src={item.image || `/placeholder.svg?height=200&width=400`}
              alt={item.name}
              className="h-full w-full object-cover transition-all hover:scale-105"
            />
          </div>
          <CardHeader className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{item.name}</CardTitle>
                <CardDescription className="mt-1 text-[#0B0A0B]/70">{item.description}</CardDescription>
              </div>
              <div className="text-lg font-semibold">${item.price.toFixed(2)}</div>
            </div>
          </CardHeader>
          <CardFooter className="p-4 pt-0">
            <Button
              onClick={() => addToCart(item)}
              className="w-full bg-[#FFDE68] text-[#0B0A0B] hover:bg-[#FFDE68]/80"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add to Order
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

