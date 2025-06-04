// Settlement-related TypeScript type definitions

export interface Settlement {
  id: number;
  amount: number;
  paidBy: string; // who made the settlement payment
  paidTo: string; // who received the settlement payment
  description?: string;
  date: string; // ISO date string (YYYY-MM-DD)
  createdAt: string; // ISO datetime string
}

// For creating new settlements
export interface CreateSettlementRequest {
  amount: number;
  paidBy: string;
  paidTo: string;
  description?: string;
  date: string;
}

// API response wrapper for settlements
export interface SettlementResponse {
  success: boolean;
  data: Settlement;
  error?: string;
  timestamp?: string;
}

// API response wrapper for settlement lists
export interface SettlementListResponse {
  success: boolean;
  data: Settlement[];
  total: number;
  error?: string;
  timestamp?: string;
}

// Settlement summary for dashboard
export interface SettlementSummary {
  totalSettlements: number;
  totalAmount: number;
  lastSettlementDate?: string;
  pendingBalance: number;
}
