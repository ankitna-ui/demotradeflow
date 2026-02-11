import React, { useState } from 'react';
import { Product } from '../types';
import { AlertCircle, Archive, ShieldCheck, TrendingUp, Search, X, Save } from 'lucide-react';

interface InventoryViewProps {
  products: Product[];
  onUpdateStock: (id: string, newStock: number) => void;
}

const InventoryView: React.FC<InventoryViewProps> = ({ products, onUpdateStock }) => {
  const [filter, setFilter] = useState<'all' | 'low' | 'pharma'>('all');
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [adjustVal, setAdjustVal] = useState<number>(0);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === 'low') return p.stock < p.minStockLevel;
    if (filter === 'pharma') return p.category === 'Pharma Supplies';
    return true;
  });

  const getStockStatus = (product: Product) => {
    if (product.stock === 0) return <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 whitespace-nowrap">Out of Stock</span>;
    if (product.stock < product.minStockLevel) return <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-700 border border-rose-200 animate-pulse whitespace-nowrap">Low Stock</span>;
    return <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200 whitespace-nowrap">In Stock</span>;
  };

  const getExpiryAlert = (dateStr?: string) => {
    if (!dateStr) return null;
    const days = Math.ceil((new Date(dateStr).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    if (days < 0) return <span className="text-rose-600 font-bold text-xs flex items-center gap-1 bg-rose-50 px-1 rounded whitespace-nowrap"><AlertCircle className="h-3 w-3" /> EXPIRED</span>;
    if (days < 90) return <span className="text-amber-600 font-bold text-xs bg-amber-50 px-1 rounded whitespace-nowrap">Exp: {days} days</span>;
    return <span className="text-slate-400 text-xs whitespace-nowrap">Exp: {dateStr}</span>;
  };

  const handleAdjustSubmit = () => {
    if (editingProduct) {
      onUpdateStock(editingProduct.id, adjustVal);
      setEditingProduct(null);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col xl:flex-row justify-between xl:items-end gap-4">
        <div>
           <h2 className="text-xl md:text-2xl font-bold text-slate-800">Inventory Control</h2>
           <p className="text-sm md:text-base text-slate-500">Manage stock levels, batch tracking, and compliance.</p>
        </div>
        <div className="flex flex-wrap gap-2">
           <button 
             onClick={() => setFilter('all')}
             className={`px-3 py-2 rounded-lg text-sm font-medium transition flex-1 sm:flex-none justify-center ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'}`}
           >
             All Items
           </button>
           <button 
             onClick={() => setFilter('pharma')}
             className={`px-3 py-2 rounded-lg text-sm font-medium transition flex-1 sm:flex-none justify-center ${filter === 'pharma' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'}`}
           >
             Pharma
           </button>
           <button 
             onClick={() => setFilter('low')}
             className={`px-3 py-2 rounded-lg text-sm font-medium transition flex-1 sm:flex-none justify-center flex items-center gap-2 ${filter === 'low' ? 'bg-rose-600 text-white' : 'bg-white text-rose-600 border border-rose-200 hover:bg-rose-50'}`}
           >
             <AlertCircle className="h-4 w-4" /> Low Stock
           </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
           <p className="text-slate-500 text-[10px] md:text-xs uppercase font-bold tracking-wider truncate">Total SKUs</p>
           <div className="flex items-end justify-between mt-2">
              <p className="text-xl md:text-3xl font-bold text-slate-800">{products.length}</p>
              <div className="bg-slate-100 p-1.5 md:p-2 rounded-full"><Archive className="h-3 w-3 md:h-4 md:w-4 text-slate-500"/></div>
           </div>
        </div>
        <div className="bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
           <p className="text-slate-500 text-[10px] md:text-xs uppercase font-bold tracking-wider truncate">Action Required</p>
           <div className="flex items-end justify-between mt-2">
              <p className="text-xl md:text-3xl font-bold text-rose-600">{products.filter(p => p.stock < p.minStockLevel).length}</p>
              <div className="bg-rose-100 p-1.5 md:p-2 rounded-full"><AlertCircle className="h-3 w-3 md:h-4 md:w-4 text-rose-500"/></div>
           </div>
        </div>
        <div className="bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
           <p className="text-slate-500 text-[10px] md:text-xs uppercase font-bold tracking-wider truncate">Pharma Batches</p>
           <div className="flex items-end justify-between mt-2">
              <p className="text-xl md:text-3xl font-bold text-blue-600">{products.filter(p => p.category === 'Pharma Supplies').length}</p>
              <div className="bg-blue-100 p-1.5 md:p-2 rounded-full"><ShieldCheck className="h-3 w-3 md:h-4 md:w-4 text-blue-500"/></div>
           </div>
        </div>
        <div className="bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
           <p className="text-slate-500 text-[10px] md:text-xs uppercase font-bold tracking-wider truncate">Stock Valuation</p>
           <div className="flex items-end justify-between mt-2">
              <p className="text-lg md:text-2xl font-bold text-slate-700 truncate">$1.2M</p>
              <span className="text-emerald-600 text-[10px] md:text-xs font-bold flex items-center">+12% <TrendingUp className="h-3 w-3 ml-1"/></span>
           </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search items..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-sm"
        />
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 md:px-6 py-4 font-semibold text-slate-600">Product</th>
                <th className="px-4 md:px-6 py-4 font-semibold text-slate-600">Category</th>
                <th className="px-4 md:px-6 py-4 font-semibold text-slate-600">Batch</th>
                <th className="px-4 md:px-6 py-4 font-semibold text-slate-600 text-right">Stock</th>
                <th className="px-4 md:px-6 py-4 font-semibold text-slate-600 text-right">Value</th>
                <th className="px-4 md:px-6 py-4 font-semibold text-slate-600 text-center">Status</th>
                <th className="px-4 md:px-6 py-4 font-semibold text-slate-600 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition group">
                  <td className="px-4 md:px-6 py-4">
                    <div className="font-bold text-slate-800 truncate max-w-[150px] md:max-w-[250px]">{p.name}</div>
                    <div className="text-xs text-slate-400 font-mono">{p.sku}</div>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.category === 'Pharma Supplies' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                      {p.category === 'Pharma Supplies' && <ShieldCheck className="h-3 w-3 mr-1" />}
                      {p.category.split(' ')[0]}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    {p.batchNumber ? (
                       <div className="flex flex-col">
                         <span className="text-xs font-mono text-slate-600 bg-slate-100 px-1 rounded w-fit mb-1">{p.batchNumber}</span>
                         {getExpiryAlert(p.expiryDate)}
                       </div>
                    ) : (
                      <span className="text-slate-400 text-xs">-</span>
                    )}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-right">
                    <div className="font-bold text-slate-700">{p.stock}</div>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-right text-slate-600 font-mono text-xs">
                    ${(p.stock * p.costPrice).toLocaleString()}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-center">
                    {getStockStatus(p)}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-center">
                    <button 
                      onClick={() => { setEditingProduct(p); setAdjustVal(p.stock); }}
                      className="text-indigo-600 hover:text-indigo-900 font-medium text-xs border border-indigo-200 px-3 py-1 rounded hover:bg-indigo-50 transition"
                    >
                      Adjust
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">
             <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <h3 className="font-bold text-slate-800">Adjust Stock</h3>
               <button onClick={() => setEditingProduct(null)}><X className="h-5 w-5 text-slate-400 hover:text-slate-600" /></button>
             </div>
             <div className="p-5">
                <div className="mb-4 text-center">
                  <p className="font-bold text-lg text-slate-800 leading-tight mb-1">{editingProduct.name}</p>
                  <p className="text-xs text-slate-400 font-mono">{editingProduct.sku}</p>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6 flex justify-between items-center">
                   <button 
                     onClick={() => setAdjustVal(prev => Math.max(0, prev - 10))}
                     className="h-10 w-10 bg-white border border-slate-300 rounded-lg flex items-center justify-center hover:bg-slate-50 text-slate-600 text-xl font-bold touch-manipulation"
                   >
                     -
                   </button>
                   <div className="text-center">
                      <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">New Qty</p>
                      <input 
                        type="number" 
                        value={adjustVal} 
                        onChange={(e) => setAdjustVal(parseInt(e.target.value) || 0)}
                        className="w-20 text-center text-3xl font-bold bg-transparent focus:outline-none text-indigo-600"
                      />
                   </div>
                   <button 
                     onClick={() => setAdjustVal(prev => prev + 10)}
                     className="h-10 w-10 bg-white border border-slate-300 rounded-lg flex items-center justify-center hover:bg-slate-50 text-slate-600 text-xl font-bold touch-manipulation"
                   >
                     +
                   </button>
                </div>

                <button 
                  onClick={handleAdjustSubmit}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" /> Save
                </button>
             </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default InventoryView;