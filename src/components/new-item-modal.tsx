// components/new-item-modal.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { NewMenuItemCard } from "@/components/new-menu-item-card";
import type { MenuItem } from "@/lib/types";

type NewItemModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (item: MenuItem) => void;
};

export const NewItemModal = ({ open, onOpenChange, onAdd }: NewItemModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Item</DialogTitle>
        </DialogHeader>
        <NewMenuItemCard 
          onAdd={(item) => {
            onAdd(item);
            onOpenChange(false);
          }} 
        />
      </DialogContent>
    </Dialog>
  );
};