/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { MenuItem } from '@/lib/types';

export const useMenuItems = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/menu/items");
      if (!res.ok) throw new Error("Erro ao carregar os itens do cardápio.");
      const data = await res.json();
      const items = data.menuItems.map((item: any) => ({
        ...item,
        price: Number(item.price),
      }));
      setMenuItems(items);
    } catch (err: any) {
      setError(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleUpdate = (updatedItem: MenuItem) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  const handleDelete = (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAdd = (newItem: MenuItem) => {
    setMenuItems((prev) => [newItem, ...prev]);
  };

  return {
    menuItems,
    loading,
    error,
    handleUpdate,
    handleDelete,
    handleAdd,
    refreshMenuItems: fetchMenuItems
  };
};