"use client";

import React, { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { useMenuItems } from "@/hooks/use-menu-items";
import { NewItemModal } from "@/components/new-item-modal";
import { MenuItemCard } from "@/components/menu-item-card";
import AdminCategoryMenu from "@/components/AdminCategoryMenu";
import { Button } from "@/components/ui/button";
import { MenuItem } from "@/lib/types";
import { PlusCircle } from "lucide-react";
import Image from "next/image";

const AdminMenu = () => {
  const { menuItems, loading, error, handleAdd, handleUpdate, handleDelete } = useMenuItems();
  const [viewMode, setViewMode] = useState<"grid" | "cards">("cards");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);


  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setIsAddingNew(false);
    // Scroll to the edit form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemUpdated = (item: MenuItem) => {
    handleUpdate(item);
    setEditingItem(null);
  };

  return (
    <div className="flex min-h-full">
      <DashboardSidebar />
      <div className="flex-1 bg-[#F6E7D7] text-[#3D2F29] ml-16 p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Gerenciar Cardápio</h1>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                onClick={() => setViewMode("cards")}
                variant={viewMode === "cards" ? "default" : "outline"}
                className={viewMode === "cards" ? "bg-[#3D2F29] text-[#F6E7D7]" : ""}
              >
                Visualização em Cards
              </Button>
              <Button
                onClick={() => setViewMode("grid")}
                variant={viewMode === "grid" ? "default" : "outline"}
                className={viewMode === "grid" ? "bg-[#3D2F29] text-[#F6E7D7]" : ""}
              >
                Visualização em Tabela
              </Button>
            </div>
            
            {!isAddingNew && !editingItem && (
              <Button 
                onClick={() => setShowAddModal(true) }
                className="bg-[#3D2F29] text-[#F6E7D7] hover:bg-[#3D2F29]/80"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Novo Item
              </Button>
            )}
          </div>
        </header>
        
        {/* Modal de Adição */}
        <NewItemModal 
          open={showAddModal}
          onOpenChange={setShowAddModal}
          onAdd={handleAdd}
        />

        
        {editingItem && (
          <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Editar Item</h2>
              <Button variant="outline" onClick={() => setEditingItem(null)}>Cancelar</Button>
            </div>
            <MenuItemCard 
              item={editingItem} 
              onUpdate={handleItemUpdated} 
              onDelete={(id) => {
                handleDelete(id);
                setEditingItem(null);
              }} 
            />
          </div>
        )}

        {/* Conteúdo principal */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-lg">Carregando itens do cardápio...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            <p>{error}</p>
          </div>
        ) : (
          <>
            {viewMode === "cards" ? (
              <AdminCategoryMenu 
                items={menuItems} 
                onEdit={handleEditItem} 
                onDelete={handleDelete} 
                onAddNew={() => setIsAddingNew(true)}
              />
            ) : (
              <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagem</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {menuItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.imageUrl && (
                            <div className="h-12 w-12 rounded overflow-hidden">
                              <Image
                                src={item.imageUrl}
                                alt={item.name}
                                width={48}
                                height={48}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 max-w-xs truncate">{item.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">R$ {Number(item.price).toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.category.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.isAvailable 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {item.isAvailable ? 'Disponível' : 'Indisponível'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleEditItem(item)}
                              className="bg-[#3D2F29] text-[#F6E7D7] hover:bg-[#3D2F29]/80"
                            >
                              Editar
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleDelete(item.id)}
                              className="bg-transparent border-red-600 text-red-600 hover:bg-red-50"
                            >
                              Remover
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    
                    {menuItems.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                          Nenhum item encontrado. Adicione itens ao cardápio.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminMenu;