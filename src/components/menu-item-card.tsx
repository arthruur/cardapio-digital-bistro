/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, ChangeEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MenuItem, MenuItemFormData } from "@/lib/types";
import Image from "next/image";

type MenuItemCardProps = {
  item: MenuItem;
  onUpdate: (item: MenuItem) => void;
  onDelete: (id: string) => void;
};

export const MenuItemCard = ({ item, onUpdate }: MenuItemCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<MenuItemFormData>({
    name: item.name,
    description: item.description || "",
    price: String(item.price),
    imageUrl: item.imageUrl || "",
    isAvailable: item.isAvailable,
    categoryId: item.category.id,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setEditData((prev) => ({
      ...prev,
      [target.name]: value,
    }));
  };

  const handleSave = async () => {
    if (!editData.name || !editData.price || !editData.categoryId) {
      alert("Nome, preço e categoria são obrigatórios.");
      return;
    }
    const payload = {
      name: editData.name,
      description: editData.description,
      price: Number(editData.price),
      imageUrl: editData.imageUrl,
      isAvailable: editData.isAvailable,
      categoryId: editData.categoryId,
    };

    try {
      const res = await fetch(`/api/menu/items?menuItemId=${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erro ao atualizar o item.");
      }
      const data = await res.json();
      onUpdate(data.menuItem);
      setIsEditing(false);
    } catch (err: any) {
      alert(err.message || "Erro desconhecido");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: item.name,
      description: item.description || "",
      price: String(item.price),
      imageUrl: item.imageUrl || "",
      isAvailable: item.isAvailable,
      categoryId: item.category.id,
    });
  };


  return (
    <Card className="shadow">
      <CardHeader>
        {isEditing ? (
          <CardTitle>Editar Item</CardTitle>
        ) : (
          <CardTitle>{item.name}</CardTitle>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-2">
            <div>
              <Label htmlFor={`name-${item.id}`}>Nome</Label>
              <Input
                id={`name-${item.id}`}
                type="text"
                name="name"
                value={editData.name}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor={`description-${item.id}`}>Descrição</Label>
              <Textarea
                id={`description-${item.id}`}
                name="description"
                value={editData.description}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor={`price-${item.id}`}>Preço</Label>
              <Input
                id={`price-${item.id}`}
                type="number"
                name="price"
                value={editData.price}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor={`imageUrl-${item.id}`}>URL da Imagem</Label>
              <Input
                id={`imageUrl-${item.id}`}
                type="text"
                name="imageUrl"
                value={editData.imageUrl}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor={`isAvailable-${item.id}`}>Disponível</Label>
              <Input
                id={`isAvailable-${item.id}`}
                type="checkbox"
                name="isAvailable"
                checked={editData.isAvailable}
                onChange={handleChange}
                className="h-5 w-5"
              />
            </div>
            <div>
              <Label htmlFor={`categoryId-${item.id}`}>Categoria (ID)</Label>
              <Input
                id={`categoryId-${item.id}`}
                type="text"
                name="categoryId"
                value={editData.categoryId}
                onChange={handleChange}
                className="w-full"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {item.imageUrl && (
              <Image
                src={item.imageUrl}
                alt={item.name}
                width={45}
                height={45}
                className="w-full h-40 object-cover rounded"
              />
            )}
            <p>{item.description}</p>
            <p>
              <strong>Preço:</strong> R$ {Number(item.price).toFixed(2)}
            </p>
            <p>
              <strong>Categoria:</strong> {item.category?.name}
            </p>
            <p>
              <strong>Disponível:</strong>{" "}
              {item.isAvailable ? "Sim" : "Não"}
            </p>
          </div>
        )}
      </CardContent>
      <div className="p-4 flex justify-end gap-2">
        {isEditing ? (
          <>
            <Button
              onClick={handleSave}
              className="bg-[#3D2F29] text-[#F6E7D7]"
            >
              Salvar
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
          </>
        ) : (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-[#3D2F29] text-[#F6E7D7]"
          >
            Editar
          </Button>
        )}
      </div>
    </Card>
  );
};