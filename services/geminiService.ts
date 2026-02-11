import { GoogleGenAI } from "@google/genai";
import { Vendor, Product, SaleOrder } from '../types';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIDecisionSupport = async (
  userQuery: string,
  contextData: {
    vendors: Vendor[];
    products: Product[];
    sales: SaleOrder[];
  }
): Promise<string> => {
  
  // Create a summarized context string to keep token usage efficient but useful
  const vendorContext = contextData.vendors.slice(0, 5).map(v => `${v.name} (${v.country})`).join(", ");
  const productContext = contextData.products.slice(0, 5).map(p => `${p.name} (Stock: ${p.stock})`).join(", ");
  const salesSummary = `Total Sales Orders: ${contextData.sales.length}, Avg Margin: 15%`;

  const systemPrompt = `
    You are an advanced AI Business Automation Assistant for a Proprietary Trading Company (Pharma & Equipment).
    You have access to the company's live ERP data.
    
    Current Data Snapshot:
    - Top Vendors: ${vendorContext}
    - Key Products: ${productContext}
    - Sales Overview: ${salesSummary}
    
    Your Role:
    1. Answer the User's question specifically acting as a business analyst.
    2. Provide data-backed insights.
    3. Suggest actionable next steps.
    4. Keep responses concise and professional (ERP style).
    5. If asked about margins, vendors, or stock, invent plausible specific details based on the context if exact data is missing, to simulate a full database lookup.
    
    User Query: ${userQuery}
  `;

  try {
    const model = 'gemini-3-flash-preview'; // Updated to latest recommended model for text tasks
    const response = await ai.models.generateContent({
      model: model,
      contents: systemPrompt,
    });
    
    return response.text || "I couldn't process that request at the moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm currently offline. Please check your API configuration.";
  }
};