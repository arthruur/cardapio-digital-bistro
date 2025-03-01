import type { MenuItem } from "@/types/menu"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { menuItems } from "@/data/menu-items"
import Image from "next/image"
interface CategoryMenuProps {
  category: string
  addToCart: (item: MenuItem) => void
}

export default function CategoryMenu({ category, addToCart }: CategoryMenuProps) {
  const items = menuItems.filter((item) => item.category === category)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {items.map((item) => (
        <Card key={item.id} className="overflow-hidden bg-[#F6E7D7] border-[#3D2F29] pt-0 pb-0">
          <div className="aspect-video w-full overflow-hidden bg-[#3D2F29]">
            <Image
              src={item.image || "/path/to/default/image.jpg"}
              alt={item.name}
              width={900}
              height={900}
              className="h-full w-full object-cover transition-all hover:scale-105"
            />
          </div>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{item.name}</CardTitle>
                <CardDescription className="mt-1 text-[#3D2F29]/70">{item.description}</CardDescription>
              </div>
              <div className="text-lg font-semibold">R${item.price.toFixed(0)}</div>
            </div>
          </CardHeader>
          <CardFooter className="p-4 pt-0">
            <Button
              onClick={() => addToCart(item)}
              className="w-full bg-[#3D2F29] text-[#F6E7D7] hover:bg-[#3D2F29]/80"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Fazer pedido
            </Button>
          </CardFooter>
        </Card>

      ))}    </div>
  )
}

