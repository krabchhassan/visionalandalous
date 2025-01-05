import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Suppliers from './pages/Suppliers';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Clients from './pages/Clients';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/clients" element={<Clients />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;