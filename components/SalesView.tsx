import React, { useState } from 'react';
import { SaleOrder, Client, Product } from '../types';
import { UserCheck, Plus, X } from 'lucide-react';

interface SalesViewProps {
  sales: SaleOrder[];
  clients: Client[];
  products: Product[];
  onCreateOrder: (order: SaleOrder) => void;
}

const SalesView: React.FC<SalesViewProps> = ({ sales, clients, products, onCreateOrder }) => {
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [selectedClient, setSelectedClient] = useState(clients[0]?.id);
  const [selectedProduct, setSelectedProduct] = useState(products[0]?.id);
  const [qty, setQty] = useState(10);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Lead': return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'Quotation': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Order': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Invoiced': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100';
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find(c => c.id === selectedClient);
    const product = products.find(p => p.id === selectedProduct);
    
    if (client && product) {
      const total = qty * product.sellingPrice;
      const cost = qty * product.costPrice;
      const margin = parseFloat((((total - cost) / total) * 100).toFixed(1));

      const newOrder: SaleOrder = {
        id: `SO-${9000 + sales.length + 1}`,
        clientId: client.id,
        clientName: client.name,
        date: new Date().toISOString().split('T')[0],
        status: 'Lead',
        totalAmount: total,
        currency: 'USD',
        margin: margin,
        items: [{ productId: product.id, productName: product.name, quantity: qty }]
      };
      
      onCreateOrder(newOrder);
      setShowCreateOrder(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 relative">
       
       {/* Header Actions */}
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div>
           <h2 className="text-2xl font-bold text-slate-800">Sales</h2>
           <p className="text-slate-500">Pipeline & active orders.</p>
         </div>
         <button 
           onClick={() => setShowCreateOrder(true)}
           className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 font-medium w-full sm:w-auto justify-center"
         >
           <Plus className="h-5 w-5" /> New Order
         </button>
       </div>

       {/* Pipeline Summary */}
       <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {['Lead', 'Quotation', 'Order', 'Invoiced'].map((stage) => {
            const count = sales.filter(s => s.status === stage).length;
            const value = sales.filter(s => s.status === stage).reduce((acc, curr) => acc + curr.totalAmount, 0);
            return (
              <div key={stage} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-300 transition">
                <div className={`absolute top-0 left-0 w-1.5 h-full ${stage === 'Invoiced' ? 'bg-emerald-500' : 'bg-indigo-500'}`}></div>
                <p className="text-slate-500 text-[10px] md:text-xs font-bold uppercase mb-2 tracking-wider">{stage}</p>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-1">
                   <h3 className="text-2xl md:text-3xl font-bold text-slate-800">{count}</h3>
                   <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded whitespace-nowrap">${(value/1000).toFixed(1)}k</span>
                </div>
              </div>
            )
          })}
       </div>

       {/* AI Sales Predictor */}
       <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 md:p-5">
         <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="bg-white p-2 rounded-full shadow-sm text-emerald-600 hidden sm:block">
               <UserCheck className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 sm:hidden">
                <div className="bg-white p-1 rounded-full shadow-sm text-emerald-600">
                    <UserCheck className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-emerald-900">Smart Reorder Prediction</h3>
              </div>
              <h3 className="font-bold text-emerald-900 hidden sm:block">Smart Reorder Prediction</h3>
              <p className="text-emerald-800 mt-1 mb-3 text-sm">Client <strong>Medico Pharma</strong> reorder prob: <span className="font-bold">87%</span> (in 6 days).</p>
              <button 
                onClick={() => setShowCreateOrder(true)}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition shadow-sm w-full sm:w-auto"
              >
                Draft Quotation
              </button>
            </div>
         </div>
       </div>

       <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Active Orders Table */}
          <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
             <div className="px-4 md:px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-800">Active Orders</h3>
                <button className="text-indigo-600 text-sm font-medium hover:underline">View All</button>
             </div>
             <div className="overflow-x-auto flex-1">
               <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                     <tr>
                        <th className="px-4 md:px-6 py-3 font-medium">ID</th>
                        <th className="px-4 md:px-6 py-3 font-medium">Client</th>
                        <th className="px-4 md:px-6 py-3 font-medium">Amount</th>
                        <th className="px-4 md:px-6 py-3 font-medium text-center">Margin</th>
                        <th className="px-4 md:px-6 py-3 font-medium text-center">Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {sales.slice(0, 10).map(sale => (
                       <tr key={sale.id} className="hover:bg-slate-50 cursor-pointer group transition">
                          <td className="px-4 md:px-6 py-3 font-medium text-slate-700 group-hover:text-indigo-600">{sale.id}</td>
                          <td className="px-4 md:px-6 py-3 text-slate-600 truncate max-w-[120px]">{sale.clientName}</td>
                          <td className="px-4 md:px-6 py-3 font-bold text-slate-800">${sale.totalAmount.toLocaleString()}</td>
                          <td className="px-4 md:px-6 py-3 text-center">
                             <span className={`px-2 py-0.5 rounded text-xs font-bold ${sale.margin < 10 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                {sale.margin}%
                             </span>
                          </td>
                          <td className="px-4 md:px-6 py-3 text-center">
                             <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold border ${getStatusColor(sale.status)}`}>
                                {sale.status}
                             </span>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
             </div>
          </div>

          {/* Client List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-4 h-fit xl:sticky xl:top-24">
             <h3 className="font-bold text-slate-800 mb-2 px-2">Key Clients</h3>
             <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
             {clients.sort((a,b) => b.totalSales - a.totalSales).slice(0, 6).map(client => (
                <div key={client.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition border border-transparent hover:border-slate-100">
                   <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm flex-shrink-0">
                         {client.name.substring(0,2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                         <p className="text-sm font-bold text-slate-700 truncate max-w-[120px]">{client.name}</p>
                         <p className="text-xs text-slate-500 truncate">{client.country}</p>
                      </div>
                   </div>
                   <div className="text-right flex-shrink-0 pl-2">
                      <p className="text-sm font-bold text-slate-800">${(client.totalSales/1000).toFixed(0)}k</p>
                      <p className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full inline-block">TOP</p>
                   </div>
                </div>
             ))}
             </div>
             <button className="w-full py-3 mt-2 border border-dashed border-slate-300 rounded-xl text-slate-500 text-sm hover:border-indigo-500 hover:text-indigo-600 transition font-medium">
                + Add New Client
             </button>
          </div>
       </div>

       {/* Create Order Modal */}
       {showCreateOrder && (
         <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="bg-white rounded-t-xl sm:rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
             <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white flex-shrink-0">
               <h3 className="text-lg font-bold">New Sales Order</h3>
               <button onClick={() => setShowCreateOrder(false)} className="p-2 hover:bg-indigo-500 rounded-full transition">
                 <X className="h-5 w-5 text-indigo-100" />
               </button>
             </div>
             
             <form onSubmit={handleCreateSubmit} className="p-5 space-y-5 overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Customer</label>
                  <select 
                    value={selectedClient} 
                    onChange={(e) => setSelectedClient(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                     {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                   <div className="col-span-2">
                     <label className="block text-sm font-medium text-slate-700 mb-1">Product</label>
                     <select 
                       value={selectedProduct}
                       onChange={(e) => setSelectedProduct(e.target.value)}
                       className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-sm"
                     >
                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                     </select>
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Qty</label>
                     <input 
                       type="number" 
                       value={qty}
                       onChange={(e) => setQty(parseInt(e.target.value))}
                       className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                     />
                   </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-500 text-sm">Unit Price</span>
                      <span className="font-mono text-slate-700">${products.find(p => p.id === selectedProduct)?.sellingPrice}</span>
                   </div>
                   <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                      <span className="font-bold text-slate-800">Total</span>
                      <span className="font-bold text-xl text-indigo-600">
                        ${(qty * (products.find(p => p.id === selectedProduct)?.sellingPrice || 0)).toLocaleString()}
                      </span>
                   </div>
                </div>

                <div className="flex gap-3 pt-2">
                   <button 
                     type="button" 
                     onClick={() => setShowCreateOrder(false)}
                     className="flex-1 px-4 py-3 bg-white border border-slate-300 text-slate-700 rounded-lg font-bold hover:bg-slate-50 transition"
                   >
                     Cancel
                   </button>
                   <button 
                     type="submit" 
                     className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                   >
                     Create
                   </button>
                </div>
             </form>
           </div>
         </div>
       )}

    </div>
  );
};

export default SalesView;