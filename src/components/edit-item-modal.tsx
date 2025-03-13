"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MenuItemCard } from "@/components/menu-item-card"; // Changed from EditMenuItemCard
import type { MenuItem } from "@/lib/types";

type EditItemModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: MenuItem;
  onUpdate: (item: MenuItem) => void;
  onDelete: (id: string) => void; // Added onDelete prop
};

export const EditItemModal = ({ 
  open, 
  onOpenChange, 
  item, 
  onUpdate,
  onDelete 
}: EditItemModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Editar Item</DialogTitle>
        </DialogHeader>
        <MenuItemCard
          item={item}
          onUpdate={(updatedItem) => {
            onUpdate(updatedItem);
            onOpenChange(false);
          }}
          onDelete={(id) => {
            onDelete(id);
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};