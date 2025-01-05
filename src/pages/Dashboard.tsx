import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { BarChart, Users, Package, ShoppingCart } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSuppliers: 0,
    totalClients: 0,
    totalOrders: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [
        { count: productsCount },
        { count: suppliersCount },
        { count: clientsCount },
        { count: ordersCount },
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact' }),
        supabase.from('suppliers').select('*', { count: 'exact' }),
        supabase.from('clients').select('*', { count: 'exact' }),
        supabase.from('orders').select('*', { count: 'exact' }),
      ]);

      setStats({
        totalProducts: productsCount || 0,
        totalSuppliers: suppliersCount || 0,
        totalClients: clientsCount || 0,
        totalOrders: ordersCount || 0,
      });
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Tableau de bord</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Produits</p>
              <p className="text-2xl font-bold">{stats.totalProducts}</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Fournisseurs</p>
              <p className="text-2xl font-bold">{stats.totalSuppliers}</p>
            </div>
            <Users className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Clients</p>
              <p className="text-2xl font-bold">{stats.totalClients}</p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Commandes</p>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Statistiques récentes</h2>
        <div className="flex items-center justify-center h-64">
          <BarChart className="h-32 w-32 text-gray-300" />
          <p className="text-gray-500">Les graphiques seront disponibles prochainement</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;