import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  UserCircle,
  Glasses
} from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="bg-white w-64 min-h-screen shadow-lg">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-8">
          <Glasses className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold">Vision Al Andalous</span>
        </div>
        
        <nav className="space-y-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-lg ${
                isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Tableau de bord</span>
          </NavLink>

          <NavLink
            to="/suppliers"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-lg ${
                isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <Users className="h-5 w-5" />
            <span>Fournisseurs</span>
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-lg ${
                isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <Package className="h-5 w-5" />
            <span>Produits</span>
          </NavLink>

          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-lg ${
                isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <ShoppingCart className="h-5 w-5" />
            <span>Commandes</span>
          </NavLink>

          <NavLink
            to="/clients"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-lg ${
                isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <UserCircle className="h-5 w-5" />
            <span>Clients</span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;