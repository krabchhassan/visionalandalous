import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { Order, OrderItem } from '../types';
import OrderForm from '../components/orders/OrderForm';

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          client:clients(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (orderData: Partial<Order>, items: OrderItem[]) => {
    try {
      let orderId: string;

      if (editingOrder) {
        const { error } = await supabase
          .from('orders')
          .update(orderData)
          .eq('id', editingOrder.id);

        if (error) throw error;
        orderId = editingOrder.id;

        // Delete existing items
        await supabase
          .from('order_items')
          .delete()
          .eq('order_id', orderId);
      } else {
        const { data, error } = await supabase
          .from('orders')
          .insert(orderData)
          .select()
          .single();

        if (error) throw error;
        orderId = data.id;
      }

      // Insert new items
      const orderItems = items.map(item => ({
        order_id: orderId,
        ...item
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      setShowForm(false);
      setEditingOrder(null);
      fetchOrders();
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Commandes</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Nouvelle Commande
        </button>
      </div>

      {showForm && (
        <OrderForm
          order={editingOrder}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingOrder(null);
          }}
        />
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Montant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {format(new Date(order.created_at), 'dd/MM/yyyy')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order.client?.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.total_amount} Dhs</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => {
                      setEditingOrder(order);
                      setShowForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;