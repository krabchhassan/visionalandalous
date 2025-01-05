import React, { useState } from 'react';
import { Supplier } from '../../types';

interface SupplierFormProps {
  supplier?: Supplier | null;
  onSubmit: (data: Partial<Supplier>) => void;
  onCancel: () => void;
}

const SupplierForm = ({ supplier, onSubmit, onCancel }: SupplierFormProps) => {
  const [formData, setFormData] = useState<Partial<Supplier>>({
    name: supplier?.name || '',
    contact: supplier?.contact || '',
    address: supplier?.address || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact
          </label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adresse
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
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
          {supplier ? 'Modifier' : 'Créer'}
        </button>
      </div>
    </form>
  );
};

export default SupplierForm;