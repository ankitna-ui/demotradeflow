import React, { useState, useEffect, useMemo } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import VendorView from './components/VendorView';
import InventoryView from './components/InventoryView';
import SalesView from './components/SalesView';
import FinanceView from './components/FinanceView';
import AIChat from './components/AIChat';

// Data Services
import { 
  generateVendors, 
  generateProducts, 
  generatePOs, 
  generateClients, 
  generateSales, 
  generateFinanceData 
} from './services/mockData';

import { Vendor, Product, PurchaseOrder, Client, SaleOrder, FinanceMetric } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoaded, setIsLoaded] = useState(false);

  // Application State
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [pos, setPos] = useState<PurchaseOrder[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [sales, setSales] = useState<SaleOrder[]>([]);
  const [financeData, setFinanceData] = useState<FinanceMetric[]>([]);

  // Initialize Mock Data
  useEffect(() => {
    // Simulate loading delay for "Real System" feel
    setTimeout(() => {
      const v = generateVendors();
      const p = generateProducts();
      const pOrders = generatePOs(v, p);
      const c = generateClients();
      const s = generateSales(c, p);
      const f = generateFinanceData();

      setVendors(v);
      setProducts(p);
      setPos(pOrders);
      setClients(c);
      setSales(s);
      setFinanceData(f);
      setIsLoaded(true);
    }, 800);
  }, []);

  // --- Actions (Simulating Backend Mutations) ---

  const handleUpdateStock = (productId: string, newStock: number) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, stock: newStock } : p
    ));
  };

  const handleCreateOrder = (newOrder: SaleOrder) => {
    setSales(prev => [newOrder, ...prev]);
  };

  const handleCreatePO = (newPO: PurchaseOrder) => {
    setPos(prev => [newPO, ...prev]);
  };

  // --- Derived State ---

  const totalInventoryValue = useMemo(() => {
    return products.reduce((acc, curr) => acc + (curr.stock * curr.costPrice), 0);
  }, [products]);

  const topClients = useMemo(() => {
    return [...clients].sort((a,b) => b.totalSales - a.totalSales);
  }, [clients]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
         <div className="h-16 w-16 bg-indigo-600 rounded-xl animate-pulse mb-4 flex items-center justify-center shadow-xl shadow-indigo-300">
            <span className="text-white font-bold text-2xl">T</span>
         </div>
         <h2 className="text-slate-800 font-bold text-xl mb-2">TradeFlow AI</h2>
         <p className="text-slate-500">Initializing ERP Modules...</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard 
                  financeData={financeData} 
                  topClients={topClients} 
                  topVendors={vendors} 
                  inventoryValue={totalInventoryValue}
               />;
      case 'vendors':
        return <VendorView 
                  vendors={vendors} 
                  purchaseOrders={pos} 
                  products={products}
                  onCreatePO={handleCreatePO}
               />;
      case 'inventory':
        return <InventoryView 
                  products={products} 
                  onUpdateStock={handleUpdateStock}
               />;
      case 'sales':
        return <SalesView 
                  sales={sales} 
                  clients={clients} 
                  products={products}
                  onCreateOrder={handleCreateOrder}
               />;
      case 'finance':
        return <FinanceView sales={sales} />;
      default:
        return <Dashboard 
                  financeData={financeData} 
                  topClients={topClients} 
                  topVendors={vendors} 
                  inventoryValue={totalInventoryValue}
               />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
      <AIChat vendors={vendors} products={products} sales={sales} />
    </Layout>
  );
};

export default App;
