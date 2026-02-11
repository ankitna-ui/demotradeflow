import { Vendor, Product, PurchaseOrder, Client, SaleOrder, FinanceMetric } from '../types';

// Helpers
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomFloat = (min: number, max: number) => parseFloat((Math.random() * (max - min) + min).toFixed(2));
const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString().split('T')[0];
};

// 1. Vendors
const vendorNames = [
  "Global Tech Supplies", "MediSafe China Ltd", "EuroLab Partners", "IndoChem Traders", 
  "Dubai Logistics Group", "Sinopharm Exports", "Berlin Medical Devices", "Singapore Trade Hub",
  "Mumbai Surgical Works", "Shanghai Plastics Co", "Apex Business Sol", "Emirates Bulk Buy",
  "Hanover Office Systems", "Pearl River Trading", "Ganga Pharma Exports"
];

export const generateVendors = (): Vendor[] => {
  const countries = ['India', 'China', 'Germany', 'UAE', 'Singapore'];
  return vendorNames.map((name, i) => ({
    id: `V-${100 + i}`,
    name,
    country: countries[i % countries.length] as any,
    productsSupplied: ['Medical Kits', 'Office Paper', 'Lab Equipment'],
    contractPriceIndex: getRandomFloat(0.9, 1.1),
    contractEnd: addDays(new Date(), getRandomInt(10, 365)),
    paymentTerms: ['Net 30', 'Net 60', 'Advance'][i % 3],
    rating: getRandomFloat(3.5, 5.0)
  }));
};

// 2. Products (Including Pharma)
export const generateProducts = (): Product[] => {
  const products: Product[] = [];
  const categories = ['Office Supplies', 'Equipment', 'Pharma Supplies'];
  
  for (let i = 0; i < 55; i++) {
    const category = categories[i % 3] as any;
    const isPharma = category === 'Pharma Supplies';
    
    products.push({
      id: `P-${1000 + i}`,
      name: isPharma ? `Pharma Grade Compound ${String.fromCharCode(65 + (i%26))}` : `Business Item ${i}`,
      category,
      stock: getRandomInt(0, 500),
      unit: isPharma ? 'Box' : 'Unit',
      costPrice: getRandomInt(10, 500),
      sellingPrice: 0, // Calculated later
      sku: `SKU-${8000 + i}`,
      batchNumber: isPharma ? `BATCH-${getRandomInt(100,999)}` : undefined,
      expiryDate: isPharma ? addDays(new Date(), getRandomInt(-30, 700)) : undefined, // Some expired
      minStockLevel: 50,
      demandTrend: ['up', 'down', 'stable'][getRandomInt(0, 2)] as any
    });
    // Set margin
    products[i].sellingPrice = Math.floor(products[i].costPrice * getRandomFloat(1.15, 1.6));
  }
  
  // Hardcode specific demo items
  products[0].name = "Medical Disposable Kit A";
  products[0].category = "Pharma Supplies";
  products[0].demandTrend = "up";
  
  return products;
};

// 3. Purchase Orders
export const generatePOs = (vendors: Vendor[], products: Product[]): PurchaseOrder[] => {
  return Array.from({ length: 25 }).map((_, i) => {
    const vendor = vendors[getRandomInt(0, vendors.length - 1)];
    return {
      id: `PO-${2045 + i}`,
      vendorId: vendor.id,
      vendorName: vendor.name,
      date: addDays(new Date(), -getRandomInt(0, 60)),
      status: ['Approved', 'Pending', 'Delivered'][getRandomInt(0, 2)] as any,
      totalAmount: getRandomInt(5000, 50000),
      items: [{
        productId: products[0].id,
        productName: products[0].name,
        quantity: getRandomInt(100, 1000)
      }],
      currency: vendor.country === 'USA' ? 'USD' : vendor.country === 'Germany' ? 'EUR' : 'USD'
    };
  });
};

// 4. Clients
export const generateClients = (): Client[] => {
  return Array.from({ length: 30 }).map((_, i) => ({
    id: `C-${500 + i}`,
    name: i === 0 ? "Medico Pharma Pvt Ltd" : `Client Enterprise ${String.fromCharCode(65 + (i%26))}${i}`,
    type: ['Corporate', 'Distributor', 'Pharmaceutical Company'][getRandomInt(0, 2)] as any,
    country: ['India', 'UAE', 'USA', 'UK'][getRandomInt(0, 3)] as any,
    totalSales: getRandomInt(10000, 500000),
    lastOrderDate: addDays(new Date(), -getRandomInt(0, 45)),
    reorderProbability: getRandomInt(40, 95)
  }));
};

// 5. Sales Orders
export const generateSales = (clients: Client[], products: Product[]): SaleOrder[] => {
  return Array.from({ length: 45 }).map((_, i) => {
    const client = clients[getRandomInt(0, clients.length - 1)];
    const product = products[getRandomInt(0, products.length - 1)];
    const qty = getRandomInt(10, 500);
    const total = qty * product.sellingPrice;
    const cost = qty * product.costPrice;
    
    return {
      id: `SO-${9000 + i}`,
      clientId: client.id,
      clientName: client.name,
      date: addDays(new Date(), -getRandomInt(0, 90)),
      status: ['Lead', 'Quotation', 'Order', 'Invoiced'][getRandomInt(0, 3)] as any,
      totalAmount: total,
      currency: 'USD',
      margin: parseFloat((((total - cost) / total) * 100).toFixed(1)),
      items: [{
        productId: product.id,
        productName: product.name,
        quantity: qty
      }]
    };
  });
};

// 6. Finance Data
export const generateFinanceData = (): FinanceMetric[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map(m => {
    const revenue = getRandomInt(120000, 180000);
    const expenses = getRandomInt(80000, 110000);
    return {
      month: m,
      revenue,
      expenses,
      profit: revenue - expenses
    };
  });
};
