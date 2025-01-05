import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Order, Client, Product, OrderItem } from '../../types';

interface OrderFormProps {
  order?: Order | null;
  onSubmit: (data: Partial<Order>, items: OrderItem[]) => void;
  onCancel: () => void;
}

const OrderForm = ({ order, onSubmit, onCancel }: OrderFormProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [formData, setFormData] = useState<Partial<Order>>({
    client_id: order?.client_id || '',
    status: order?.status || 'pending',
    total_amount: order?.total_amount || 0,
  });

  useEffect(() => {
    fetchClients();
    fetchProducts();
  }, []);

  const fetchClients = async () => {
    const { data } = await supabase.from('clients').select('*').order('name');
    setClients(data || []);
  };

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('name');
    setProducts(data || []);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const addItem = () => {
    setItems([...items, { product_id: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof OrderItem, value: string | number) => {
    const newItems = [...items];
    if (field === 'product_id') {
      const product = products.find(p => p.id === value);
      newItems[index] = {
        ...newItems[index],
        [field]: value,
        price: product?.price || 0
      };
    } else {
      newItems[index] = {
        ...newItems[index],
        [field]: value
      };
    }
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const total = calculateTotal();
    onSubmit({ ...formData, total_amount: total }, items);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6">
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Client
          </label>
          <select
            name="client_id"
            value={formData.client_id}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Sélectionner un client</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Statut
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="pending">En attente</option>
            <option value="processing">En cours</option>
            <option value="completed">Terminée</option>
            <option value="cancelled">Annulée</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Produits</h3>
          <button
            type="button"
            onClick={addItem}
            className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
          >
            + Ajouter un produit
          </button>
        </div>

        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-12 gap-4 mb-4">
            <div className="col-span-5">
              <select
                value={item.product_id}
                onChange={(e) => updateItem(index, 'product_id', e.target.value)}
                required
                className="w-full p-2 border rounded-lg"
              >
                <option value="">Sélectionner un produit</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {product.price} Dhs
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                min="1"
                required
                className="w-full p-2 border rounded-lg"
                placeholder="Quantité"
              />
            </div>
            <div className="col-span-3">
              <input
                type="number"
                value={item.price}
                readOnly
                className="w-full p-2 border rounded-lg bg-gray-50"
                placeholder="Prix"
              />
            </div>
            <div className="col-span-2 flex items-center justify-end">
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-red-600 hover:text-red-800"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}

        <div className="text-right mt-4">
          <p className="text-lg font-medium">
            Total: {calculateTotal()} Dhs
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          {order ? 'Modifier' : 'Créer'}
        </button>
      </div>
    </form>
  );
};

export default OrderForm;