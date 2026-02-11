import React from 'react';
import { SaleOrder } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertOctagon } from 'lucide-react';

interface FinanceViewProps {
  sales: SaleOrder[];
}

const FinanceView: React.FC<FinanceViewProps> = ({ sales }) => {
  // Sort sales by margin (ascending) to show low margin deals
  const lowMarginDeals = [...sales].sort((a,b) => a.margin - b.margin).slice(0, 5);
  
  // Aggregate data for a mock chart (Profit by Currency)
  const chartData = [
    { name: 'USD', profit: 45000 },
    { name: 'EUR', profit: 12000 },
    { name: 'INR', profit: 28000 },
    { name: 'AED', profit: 15000 }
  ];

  return (
    <div className="space-y-8">
      
      {/* Margin Alert AI */}
      <div className="bg-rose-50 border border-rose-200 rounded-lg p-5 flex flex-col md:flex-row gap-4 items-start">
         <div className="bg-rose-100 p-2 rounded-full flex-shrink-0">
            <AlertOctagon className="h-6 w-6 text-rose-600" />
         </div>
         <div>
            <h3 className="font-bold text-rose-900">Margin Protection Alert</h3>
            <p className="text-rose-800 text-sm mt-1">Deal ID #S-223 has a margin below threshold (8%). Suggested revised selling price to maintain 14% margin: <strong>$14,500</strong>.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Deal Margin Analysis */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 md:p-6">
           <h3 className="font-bold text-slate-800 mb-6">Low Margin Deals</h3>
           <div className="space-y-4">
              {lowMarginDeals.map(deal => (
                 <div key={deal.id} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0">
                    <div className="min-w-0 pr-2">
                       <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-700 text-sm whitespace-nowrap">{deal.id}</span>
                          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded truncate max-w-[120px]">{deal.clientName}</span>
                       </div>
                       <p className="text-xs text-slate-400 mt-1">Amt: ${deal.totalAmount.toLocaleString()}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                       <span className="block font-bold text-rose-600 text-base md:text-lg">{deal.margin}%</span>
                       <span className="text-[10px] md:text-xs text-slate-400">Goal: 15%</span>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* Currency Profitability */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 md:p-6">
           <h3 className="font-bold text-slate-800 mb-6">Profit by Currency</h3>
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={chartData}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} />
                 <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                 <Tooltip cursor={{fill: '#f1f5f9'}} />
                 <Bar dataKey="profit" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#6366f1', '#10b981', '#f59e0b', '#ec4899'][index % 4]} />
                    ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Outstanding Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
            <p className="text-slate-500 font-medium mb-2 text-sm">Total Receivables</p>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-800">$142k</h3>
            <p className="text-xs text-slate-400 mt-2">12 invoices</p>
         </div>
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
            <p className="text-slate-500 font-medium mb-2 text-sm">Avg Gross Margin</p>
            <h3 className="text-2xl md:text-3xl font-bold text-emerald-600">18.4%</h3>
            <p className="text-xs text-slate-400 mt-2">+1.2%</p>
         </div>
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
            <p className="text-slate-500 font-medium mb-2 text-sm">Cash Flow</p>
            <h3 className="text-2xl md:text-3xl font-bold text-blue-600">+$24k</h3>
            <p className="text-xs text-slate-400 mt-2">Healthy</p>
         </div>
      </div>
    </div>
  );
};

export default FinanceView;