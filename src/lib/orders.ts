// lib/orders.ts
import { v4 as uuidv4 } from 'uuid';

export interface Order {
  id: string;
  tableId: number;
  items: Array<{ name: string; quantity: number; price: number }>;
  status: string;
  createdAt: string;
}

const orders: Order[] = [];

// Function to create a new order
export const createOrder = (
  tableId: number,
  items: Array<{ name: string; quantity: number; price: number }>
): Order => {
  const newOrder: Order = {
    id: uuidv4(),
    tableId,
    items,
    status: 'novo', // initial status
    createdAt: new Date().toISOString(),
  };
  orders.push(newOrder);
  return newOrder;
};

// Function to get all orders for a specific table
export const getOrdersByTable = (tableId: number): Order[] => {
  return orders.filter((order) => order.tableId === tableId);
};

// Function to get all orders
export const getAllOrders = (): Order[] => {
  return [...orders];
};

// Function to update the status of an order
export const updateOrderStatus = (orderId: string, newStatus: string): Order | null => {
  const orderIndex = orders.findIndex((order) => order.id === orderId);
  if (orderIndex !== -1) {
    orders[orderIndex].status = newStatus;
    return orders[orderIndex];
  }
  return null; // Order not found
};

