import React, { useState } from 'react';
import { Vendor, PurchaseOrder, Product } from '../types';
import { Truck, CheckCircle, Clock, FileText, Globe, TrendingDown, Plus, X, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

interface VendorViewProps {
  vendors: Vendor[];
  purchaseOrders: PurchaseOrder[];
  products: Product[];
  onCreatePO: (po: PurchaseOrder) => void;
}

const VendorView: React.FC<VendorViewProps> = ({ vendors, purchaseOrders, products, onCreatePO }) => {
  const [showComparison, setShowComparison] = useState(false);
  const [showCreatePO, setShowCreatePO] = useState(false);
  
  // Dummy data for comparison
  const comparisonData = [
    { vendor: 'MediSafe', price: 12.50, country: 'CN' },
    { vendor: 'Global', price: 14.20, country: 'IN' },
    { vendor: 'Berlin', price: 15.80, country: 'DE' },
  ];

  const handleCreatePOSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const vendor = vendors[0];
    const newPO: PurchaseOrder = {
      id: `PO-${Math.floor(Math.random() * 10000)}`,
      vendorId: vendor.id,
      vendorName: vendor.name,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      totalAmount: 15400,
      items: [{ productId: 'P-1001', productName: 'New Order Item', quantity: 500 }],
      currency: 'USD'
    };
    onCreatePO(newPO);
    setShowCreatePO(false);
  };

  return (
    <div className="space-y-6 md:space-y-8 relative">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Vendor Management</h2>
          <p className="text-slate-500">Contracts, prices & shipments.</p>
        </div>
        <button 
          onClick={() => setShowCreatePO(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition shadow-sm w-full sm:w-auto justify-center"
        >
          <Plus className="h-4 w-4" /> <span className="whitespace-nowrap">Create PO</span>
        </button>
      </div>

      {/* AI Insight Box */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 shadow-sm">
        <div className="bg-indigo-100 p-3 rounded-xl h-fit w-fit hidden md:block">
          <Truck className="h-8 w-8 text-indigo-700" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-indigo-600 text-white text-[10px] md:text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider">AI Insight</span>
            <span className="text-slate-500 text-xs">Just now</span>
          </div>
          <h3 className="font-bold text-indigo-900 text-base md:text-lg">Procurement Opportunity Detected</h3>
          <p className="text-indigo-800 mt-2 text-sm leading-relaxed">
            Vendor <strong>{vendors[1]?.name} (China)</strong> has lowered unit costs for 'Medical Disposable Kits' by <span className="font-bold text-emerald-600">6.2%</span>. 
            Shifting 40% of Q3 volume from {vendors[2]?.name} could save <strong>$12,400</strong>.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
             <button 
               onClick={() => setShowComparison(true)}
               className="bg-white text-indigo-700 border border-indigo-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition flex items-center gap-2 shadow-sm"
             >
               <BarChart3 className="h-4 w-4" /> View Analysis
             </button>
             <button className="text-indigo-600 text-sm font-medium hover:underline px-2">Dismiss</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
        {/* Vendor List */}
        <div className="xl:col-span-2 space-y-4 md:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              Active Contracts
              <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full border border-slate-200">{vendors.length}</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {vendors.slice(0, 6).map(vendor => (
              <div key={vendor.id} className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-sm hover:shadow-md transition cursor-pointer group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-slate-50 to-transparent -mr-8 -mt-8 rounded-full"></div>
                
                <div className="flex justify-between items-start mb-4 relative">
                  <div className="min-w-0 pr-2">
                    <h4 className="font-bold text-slate-800 text-base md:text-lg group-hover:text-indigo-600 transition truncate">{vendor.name}</h4>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-1 font-medium">
                      <Globe className="h-3 w-3" />
                      {vendor.country}
                    </div>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-lg font-bold flex items-center gap-1 flex-shrink-0 ${vendor.rating > 4.5 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
                    ★ {vendor.rating}
                  </div>
                </div>
                
                <div className="space-y-2 text-sm relative">
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-500">Product</span>
                    <span className="text-slate-700 font-medium truncate max-w-[100px]">{vendor.productsSupplied[0]}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">End Date</span>
                    <span className={`font-mono font-medium text-xs ${new Date(vendor.contractEnd) < new Date(new Date().setMonth(new Date().getMonth() + 1)) ? 'text-rose-600 bg-rose-50 px-1 rounded' : 'text-slate-700'}`}>
                      {vendor.contractEnd}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Purchase Orders */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm h-fit xl:sticky xl:top-24">
          <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-xl flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Recent POs</h3>
            <button className="text-xs text-indigo-600 font-medium hover:underline">View All</button>
          </div>
          <div className="max-h-[400px] xl:max-h-[600px] overflow-y-auto divide-y divide-slate-100">
            {purchaseOrders.map(po => (
              <div key={po.id} className="p-4 hover:bg-slate-50 transition flex items-center justify-between group cursor-pointer">
                <div className="flex items-start gap-3 min-w-0">
                   <div className="mt-1 flex-shrink-0">
                      {po.status === 'Approved' && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                      {po.status === 'Pending' && <Clock className="h-4 w-4 text-amber-500" />}
                      {po.status === 'Delivered' && <FileText className="h-4 w-4 text-blue-500" />}
                   </div>
                   <div className="min-w-0">
                     <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition truncate">{po.id}</p>
                     <p className="text-xs text-slate-500 truncate">{po.vendorName}</p>
                   </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p className="text-sm font-bold text-slate-700 font-mono whitespace-nowrap">{po.currency} {po.totalAmount.toLocaleString()}</p>
                  <p className="text-[10px] uppercase font-bold text-slate-400">{po.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* Price Comparison Modal */}
      {showComparison && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-t-xl sm:rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center flex-shrink-0">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-800">Price Analysis</h3>
                <p className="text-slate-500 text-xs sm:text-sm truncate max-w-[200px] sm:max-w-none">Item: Medical Disposable Kit</p>
              </div>
              <button onClick={() => setShowComparison(false)} className="p-2 hover:bg-slate-100 rounded-full transition">
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-4 sm:p-6 overflow-y-auto">
              <div className="h-56 sm:h-64 w-full mb-6">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData} layout="vertical" margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" tickFormatter={(val) => `$${val}`} />
                      <YAxis dataKey="vendor" type="category" width={80} style={{ fontSize: '11px', fontWeight: 500 }} />
                      <Tooltip cursor={{fill: '#f8fafc'}} />
                      <Bar dataKey="price" radius={[0, 4, 4, 0]} barSize={24}>
                        {comparisonData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#64748b'} />
                        ))}
                      </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 flex gap-3">
                 <TrendingDown className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                 <div>
                    <h4 className="font-bold text-emerald-900 text-sm">Recommendation</h4>
                    <p className="text-emerald-800 text-xs sm:text-sm">Switching to <strong>MediSafe China</strong> saves <strong>$1.70/unit</strong>. Lead time +9 days.</p>
                 </div>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2 flex-shrink-0">
               <button onClick={() => setShowComparison(false)} className="px-3 py-2 text-slate-600 font-medium hover:bg-white rounded-lg transition text-sm">Close</button>
               <button onClick={() => { setShowComparison(false); setShowCreatePO(true); }} className="px-3 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition text-sm whitespace-nowrap">Create PO</button>
            </div>
          </div>
        </div>
      )}

      {/* Create PO Modal */}
      {showCreatePO && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-t-xl sm:rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white flex-shrink-0">
              <h3 className="text-lg font-bold">New PO</h3>
              <button onClick={() => setShowCreatePO(false)} className="p-2 hover:bg-indigo-500 rounded-full transition">
                <X className="h-5 w-5 text-indigo-100" />
              </button>
            </div>
            
            <form onSubmit={handleCreatePOSubmit} className="p-5 space-y-4 overflow-y-auto">
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Select Vendor</label>
                 <select className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                    {vendors.map(v => <option key={v.id} value={v.id}>{v.name} ({v.country})</option>)}
                 </select>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Product</label>
                    <select className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                        {products.slice(0, 10).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Qty</label>
                    <input type="number" defaultValue={100} className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
               </div>

               <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm">
                  <div className="flex justify-between mb-1">
                     <span className="text-slate-500">Unit Price</span>
                     <span className="font-medium text-slate-800">$12.50</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-800 border-t border-slate-200 pt-2 mt-2">
                     <span>Total Estimated</span>
                     <span>$1,375.00</span>
                  </div>
               </div>
               
               <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
                 Confirm PO
               </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default VendorView;