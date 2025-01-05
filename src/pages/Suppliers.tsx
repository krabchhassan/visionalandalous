import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Supplier } from '../types';
import SupplierForm from '../components/suppliers/SupplierForm';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSuppliers(data || []);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setSuppliers(suppliers.filter(supplier => supplier.id !== id));
    } catch (error) {
      console.error('Error deleting supplier:', error);
    }
  };

  const handleFormSubmit = async (formData: Partial<Supplier>) => {
    try {
      if (editingSupplier) {
        const { error } = await supabase
          .from('suppliers')
          .update(formData)
          .eq('id', editingSupplier.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('suppliers')
          .insert(formData);

        if (error) throw error;
      }

      setShowForm(false);
      setEditingSupplier(null);
      fetchSuppliers();
    } catch (error) {
      console.error('Error saving supplier:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Fournisseurs</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Nouveau Fournisseur
        </button>
      </div>

      {showForm && (
        <SupplierForm
          supplier={editingSupplier}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingSupplier(null);
          }}
        />
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Adresse
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {suppliers.map((supplier) => (
              <tr key={supplier.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{supplier.contact}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{supplier.address}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handleEdit(supplier)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(supplier.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
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

export default Suppliers;