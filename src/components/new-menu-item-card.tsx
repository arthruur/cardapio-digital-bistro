/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, ChangeEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MenuItem, MenuItemFormData } from "@/lib/types";

type NewMenuItemCardProps = {
  onAdd: (item: MenuItem) => void;
};

export const NewMenuItemCard = ({ onAdd }: NewMenuItemCardProps) => {
  const [formData, setFormData] = useState<MenuItemFormData>({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    isAvailable: true,
    categoryId: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setFormData((prev) => ({
      ...prev,
      [target.name]: value,
    }));
  };

  const handleCreate = async () => {
    if (!formData.name || !formData.price || !formData.categoryId) {
      alert("Nome, preço e categoria são obrigatórios.");
      return;
    }
    const payload = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      imageUrl: formData.imageUrl,
      isAvailable: formData.isAvailable,
      categoryId: formData.categoryId,
    };

    try {
      const res = await fetch("/api/menu/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erro ao criar o item.");
      }
      const data = await res.json();
      onAdd(data.menuItem);
      setFormData({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        isAvailable: true,
        categoryId: "",
      });
    } catch (err: any) {
      alert(err.message || "Erro desconhecido");
    }
  };

  return (
    <Card className="shadow mb-6">
      <CardHeader>
        <CardTitle>Novo Item</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <Label htmlFor="new-name">Nome</Label>
            <Input
              id="new-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="new-description">Descrição</Label>
            <Textarea
              id="new-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="new-price">Preço</Label>
            <Input
              id="new-price"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="new-imageUrl">URL da Imagem</Label>
            <Input
              id="new-imageUrl"
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="new-isAvailable">Disponível</Label>
            <Input
              id="new-isAvailable"
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
              className="h-5 w-5"
            />
          </div>
          <div>
            <Label htmlFor="new-categoryId">Categoria (ID)</Label>
            <Input
              id="new-categoryId"
              type="text"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full"
            />
          </div>
        </div>
      </CardContent>
      <div className="p-4 flex justify-end">
        <Button onClick={handleCreate} className="bg-[#3D2F29] text-[#F6E7D7]">
          Adicionar Item
        </Button>
      </div>
    </Card>
  );
};