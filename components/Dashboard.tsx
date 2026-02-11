import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { DollarSign, TrendingUp, Users, Package, ArrowUpRight, ArrowDownRight, Lightbulb } from 'lucide-react';
import { FinanceMetric, Client, Vendor, Product } from '../types';

interface DashboardProps {
  financeData: FinanceMetric[];
  topClients: Client[];
  topVendors: Vendor[];
  inventoryValue: number;
}

const Dashboard: React.FC<DashboardProps> = ({ financeData, topClients, topVendors, inventoryValue }) => {
  
  const StatCard = ({ title, value, trend, icon: Icon, color }: any) => (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition flex flex-col justify-between">
      <div className="flex justify-between items-start mb-2">
        <div className="min-w-0">
          <p className="text-slate-500 text-xs md:text-sm font-medium mb-1 truncate">{title}</p>
          <h3 className="text-xl md:text-2xl font-bold text-slate-800 truncate">{value}</h3>
        </div>
        <div className={`p-2 rounded-lg ${color} bg-opacity-10 flex-shrink-0`}>
          <Icon className={`h-5 w-5 md:h-6 md:w-6 ${color.replace('bg-', 'text-')}`} />
        </div>
      </div>
      <div className="mt-2 flex items-center text-xs md:text-sm">
        {trend > 0 ? (
          <span className="text-emerald-600 flex items-center font-medium">
            <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4 mr-1" /> {trend}%
          </span>
        ) : (
          <span className="text-rose-600 flex items-center font-medium">
            <ArrowDownRight className="h-3 w-3 md:h-4 md:w-4 mr-1" /> {Math.abs(trend)}%
          </span>
        )}
        <span className="text-slate-400 ml-2 truncate">vs last month</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* AI Executive Summary */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-4 flex flex-col sm:flex-row items-start gap-4">
        <div className="bg-white p-2 rounded-full shadow-sm flex-shrink-0 hidden sm:block">
          <Lightbulb className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
             <div className="bg-white p-1 rounded-full shadow-sm sm:hidden">
                <Lightbulb className="h-4 w-4 text-indigo-600" />
             </div>
             <h4 className="text-indigo-900 font-semibold">AI Executive Summary</h4>
          </div>
          <p className="text-indigo-800 text-sm leading-relaxed">
            Overall business health is strong with a <span className="font-bold">14% increase in net margin</span> this month. 
            Inventory turnover improved by 18%, but <span className="font-bold">currency fluctuations (USD/EUR)</span> may impact upcoming contracts.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Total Revenue" value="$2.4M" trend={12.5} icon={DollarSign} color="text-indigo-600 bg-indigo-600" />
        <StatCard title="Net Profit" value="$42,500" trend={-2.4} icon={TrendingUp} color="text-emerald-600 bg-emerald-600" />
        <StatCard title="Active Clients" value="34" trend={8.1} icon={Users} color="text-blue-600 bg-blue-600" />
        <StatCard title="Inventory Value" value={`$${(inventoryValue / 1000).toFixed(0)}k`} trend={5.2} icon={Package} color="text-amber-600 bg-amber-600" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Financial Chart */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-4 md:p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Financial Performance</h3>
          <div className="h-64 md:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financeData}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" tickLine={false} axisLine={false} tick={{fontSize: 12}} />
                <YAxis stroke="#64748b" tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} tick={{fontSize: 12}} width={40} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="profit" name="Profit" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Entities */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 md:p-6 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Top Clients</h3>
          <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] xl:max-h-none pr-1">
            {topClients.slice(0, 5).map((client, idx) => (
              <div key={client.id} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                    {client.name.substring(0,2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{client.name}</p>
                    <p className="text-xs text-slate-500 truncate">{client.country}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-slate-700 whitespace-nowrap ml-2">${(client.totalSales / 1000).toFixed(1)}k</span>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Top Vendors</h3>
            <div className="space-y-3">
               {topVendors.slice(0, 3).map((vendor) => (
                 <div key={vendor.id} className="flex justify-between text-sm items-center">
                    <span className="text-slate-600 truncate mr-2">{vendor.name}</span>
                    <span className="text-indigo-600 font-medium text-xs bg-indigo-50 px-2 py-0.5 rounded whitespace-nowrap">{vendor.country}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;