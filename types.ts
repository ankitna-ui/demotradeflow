export type Country = 'India' | 'China' | 'Germany' | 'UAE' | 'Singapore' | 'USA' | 'UK';

export interface Vendor {
  id: string;
  name: string;
  country: Country;
  productsSupplied: string[];
  contractPriceIndex: number; // Comparative index, 1.0 is avg
  contractEnd: string;
  paymentTerms: string;
  rating: number;
}

export interface Product {
  id: string;
  name: string;
  category: 'Office Supplies' | 'Equipment' | 'Pharma Supplies';
  stock: number;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  sku: string;
  batchNumber?: string;
  expiryDate?: string; // For Pharma
  complianceDoc?: string;
  minStockLevel: number;
  demandTrend: 'up' | 'down' | 'stable';
}

export interface PurchaseOrder {
  id: string;
  vendorId: string;
  vendorName: string;
  date: string;
  status: 'Approved' | 'Pending' | 'Delivered';
  totalAmount: number;
  items: { productId: string; productName: string; quantity: number }[];
  currency: string;
}

export interface Client {
  id: string;
  name: string;
  type: 'Corporate' | 'Distributor' | 'Pharmaceutical Company';
  country: Country;
  totalSales: number;
  lastOrderDate: string;
  reorderProbability: number;
}

export interface SaleOrder {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  status: 'Lead' | 'Quotation' | 'Order' | 'Invoiced';
  totalAmount: number;
  currency: string;
  margin: number; // percentage
  items: { productId: string; productName: string; quantity: number }[];
}

export interface FinanceMetric {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}
