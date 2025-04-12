/* eslint-disable @typescript-eslint/no-explicit-any */
// /hooks/useOrdersRealtime.ts
import { useState, useEffect } from 'react';

// Tipo baseado no modelo Prisma do Order
export interface Order {
  id: string;
  userId: string | null;
  tableId: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function useOrdersUpdates() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let eventSource: EventSource;

    const setupEventSource = () => {
      eventSource = new EventSource('/api/orders/sse');
      
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'initial') {
            // Convertendo strings de data para objetos Date
            const formattedOrders = data.orders.map((order: any) => ({
              ...order,
              createdAt: new Date(order.createdAt),
              updatedAt: new Date(order.updatedAt)
            }));
            
            setOrders(formattedOrders);
            setLoading(false);
          } else if (data.type === 'update') {
            setOrders(prevOrders => {
              // Gerenciar diferentes operações
              if (data.operation === 'INSERT') {
                const newOrder = {
                  ...data.record,
                  createdAt: new Date(data.record.createdAt),
                  updatedAt: new Date(data.record.updatedAt)
                };
                return [newOrder, ...prevOrders];
              } else if (data.operation === 'UPDATE') {
                return prevOrders.map(order => 
                  order.id === data.record.id 
                    ? {
                        ...data.record,
                        createdAt: new Date(data.record.createdAt),
                        updatedAt: new Date(data.record.updatedAt)
                      } 
                    : order
                );
              } else if (data.operation === 'DELETE') {
                return prevOrders.filter(order => order.id !== data.oldRecord.id);
              }
              return prevOrders;
            });
          }
        } catch (err) {
          console.error('Erro ao processar dados:', err);
          setError(err instanceof Error ? err : new Error('Erro desconhecido'));
        }
      };
      
      eventSource.onerror = (err) => {
        console.error('Erro de conexão SSE:', err);
        setError(new Error('Erro de conexão com o servidor'));
        setLoading(false);
        eventSource.close();
        
        // Tentar reconectar após 5 segundos em caso de erro
        setTimeout(() => {
          setupEventSource();
        }, 5000);
      };
    };
    
    setupEventSource();
    
    return () => {
      eventSource?.close();
    };
  }, []);

  return { orders, loading, error };
}