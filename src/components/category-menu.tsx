import type { MenuItem } from "@/lib/types";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, CheckCircle, XCircle } from "lucide-react"; // Importamos dois ícones: PlusCircle e CheckCircle
import Image from "next/image";
import { useState } from "react";

interface CategoryMenuProps {
  items: MenuItem[];
  addToCart: (item: MenuItem) => void;
}

export default function CategoryMenu({ items, addToCart }: CategoryMenuProps) {
  const [buttonState, setButtonState] = useState<{ id: string | null; isConfirmed: boolean }>({
    id: null,
    isConfirmed: false,
  });

  // Função para lidar com o clique no botão "Adicionar ao pedido"
  const handleAddToCart = (item: MenuItem) => {
    addToCart(item); // Adiciona o item ao carrinho
    setButtonState({ id: item.id, isConfirmed: true }); // Altera o estado do botão para confirmado

    // Retorna ao estado original após 2 segundos
    setTimeout(() => {
      setButtonState({ id: null, isConfirmed: false });
    }, 1000);
  };


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Renderiza os itens do cardápio */}
      {items.map((item) => {
        const isConfirmed = buttonState.id === item.id && buttonState.isConfirmed;
        const isAvailable = item.isAvailable

        return (
          <Card key={item.id} className={`overflow-hidden bg-[#F6E7D7] border-[#3D2F29] pt-0 pb-0 relative `}>
            {/* Indicador de indisponibilidade */}
            {!isAvailable && (
              <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs z-10">
                Indisponível
              </div>
            )}
            <div className={`aspect-video w-full overflow-hidden bg-[#3D2F29] ${!isAvailable ? 'opacity-75 grayscale-[75%]' : ''}`}>
              <Image
                src={item.imageUrl || "/path/to/default/image.jpg"}
                alt={item.name}
                width={900}
                height={900}
                className="h-full w-full object-cover transition-all hover:scale-105"
              />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className={`text-lg ${!isAvailable ? 'text-gray-500' : ''}`}>{item.name}</CardTitle>
                  <CardDescription className={`mt-1 ${!isAvailable ? 'text-gray-400' : 'text-[#3D2F29]/70'}`}>
                    {item.description}
                  </CardDescription>
                </div>
                <div className={`text-lg font-semibold ${!isAvailable ? 'text-gray-500' : ''}`}>
                  R${item.price.toFixed(0)}
                </div>
              </div>
            </CardHeader>
            <CardFooter className="p-4 pt-0">
            <Button
                onClick={() => isAvailable && handleAddToCart(item)}
                disabled={!isAvailable}
                className={`w-full ${
                  isConfirmed ? "bg-green-800 hover:bg-green-700" : 
                  !isAvailable ? "bg-gray-400 cursor-not-allowed" : "bg-[#3D2F29] hover:bg-[#3D2F29]/80"
                } text-[#F6E7D7]`}
              >
                {!isAvailable ? (
                  <>
                    <XCircle className="mr-2 h-4 w-4" />
                    Indisponível
                  </>
                ) : isConfirmed ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Adicionado!
                  </>
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar ao pedido
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}