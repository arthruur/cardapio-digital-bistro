import type { MenuItem } from "@/lib/types";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, PlusCircle, XCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface AdminCategoryMenuProps {
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

export default function AdminCategoryMenu({ 
  items, 
  onEdit, 
  onDelete, 
  onAddNew 
}: AdminCategoryMenuProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  const handleDelete = async (item: MenuItem) => {
    if (confirm(`Tem certeza que deseja remover o item "${item.name}"?`)) {
      setIsDeleting(item.id);
      try {
        await fetch(`/api/menu/items?menuItemId=${item.id}`, {
          method: "DELETE",
        });
        onDelete(item.id);
      } catch (error) {
        console.error("Erro ao remover item:", error);
        alert("Erro ao remover o item. Tente novamente.");
      } finally {
        setIsDeleting(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#3D2F29]">Itens do Cardápio</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const isAvailable = item.isAvailable;
          const isDeletingThis = isDeleting === item.id;

          return (
            <Card key={item.id} className="overflow-hidden bg-[#F6E7D7] border-[#3D2F29] pt-0 pb-0 relative">
              {/* Indicador de disponibilidade */}
              <div className={`absolute top-2 right-2 ${isAvailable ? 'bg-green-600' : 'bg-red-600'} text-white px-3 py-1 rounded-full text-xs z-10`}>
                {isAvailable ? 'Disponível' : 'Indisponível'}
              </div>
              
              <div className={`aspect-video w-full overflow-hidden bg-[#3D2F29] ${!isAvailable ? 'opacity-75 grayscale-[75%]' : ''}`}>
                <Image
                  src={item.imageUrl || "/placeholder-food.jpg"}
                  alt={item.name}
                  width={900}
                  height={900}
                  className="h-full w-full object-cover transition-all hover:scale-105"
                />
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className={`text-lg ${!isAvailable ? 'text-gray-500' : ''}`}>
                      {item.name}
                    </CardTitle>
                    <CardDescription className={`mt-1 ${!isAvailable ? 'text-gray-400' : 'text-[#3D2F29]/70'}`}>
                      {item.description}
                    </CardDescription>
                    <div className="mt-2 text-sm text-[#3D2F29]/80">
                      Categoria: <span className="font-medium">{item.category.name}</span>
                    </div>
                  </div>
                  <div className={`text-lg font-semibold ${!isAvailable ? 'text-gray-500' : ''}`}>
                    R${Number(item.price).toFixed(2)}
                  </div>
                </div>
              </CardHeader>
              
              <CardFooter className="p-4 pt-0 flex gap-2">
                <Button
                  onClick={() => onEdit(item)}
                  className="flex-1 bg-[#3D2F29] hover:bg-[#3D2F29]/80 text-[#F6E7D7]"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button
                  onClick={() => handleDelete(item)}
                  disabled={isDeletingThis}
                  className="flex-1 bg-white border border-red-600 text-red-600 hover:bg-red-50"
                >
                  {isDeletingThis ? (
                    "Removendo..."
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remover
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
        
        {items.length === 0 && (
          <div className="col-span-full text-center p-8 bg-[#F6E7D7]/50 rounded-lg border border-dashed border-[#3D2F29]/30">
            <XCircle className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-600">Nenhum item encontrado</h3>
            <p className="text-gray-500 mt-1">Adicione itens ao cardápio para visualizá-los aqui.</p>
            <Button 
              onClick={onAddNew}
              className="mt-4 bg-[#3D2F29] text-[#F6E7D7] hover:bg-[#3D2F29]/80"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Primeiro Item
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}