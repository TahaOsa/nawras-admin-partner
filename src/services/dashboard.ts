// Dashboard API service
import { config, logger } from '../lib/config';

// API base URL from configuration
const API_BASE_URL = config.apiBaseUrl;

export interface DashboardData {
  totalExpenses: number;
  totalSettlements: number;
  expensesByCategory: Record<string, number>;
  monthlyExpenses: Record<string, number>;
  userBalances: UserBalance[];
  recentExpenses: any[];
  recentSettlements: any[];
}

export interface UserBalance {
  user_id: string;
  name: string;
  balance: number;
  partnershipBalance: number;
  totalPaid: number;
  totalOwes: number;
  totalExpenses: number;
  settlementsOut: number;
  settlementsIn: number;
}

/**
 * Fetch dashboard data from backend API
 * This includes pre-calculated partnership balances
 */
export async function fetchDashboardData(): Promise<DashboardData> {
  logger.debug('Fetching dashboard data from API');

  const url = `${API_BASE_URL}/api/dashboard`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      logger.error('Failed to fetch dashboard data:', response.status, response.statusText);
      throw new Error(`Failed to fetch dashboard data: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Ensure we have safe default values for empty states
    const safeData: DashboardData = {
      totalExpenses: data.totalExpenses || 0,
      totalSettlements: data.totalSettlements || 0,
      expensesByCategory: data.expensesByCategory || {},
      monthlyExpenses: data.monthlyExpenses || {},
      userBalances: Array.isArray(data.userBalances) ? data.userBalances : [],
      recentExpenses: Array.isArray(data.recentExpenses) ? data.recentExpenses : [],
      recentSettlements: Array.isArray(data.recentSettlements) ? data.recentSettlements : []
    };

    logger.debug('Successfully fetched dashboard data:', safeData);
    
    return safeData;
  } catch (error) {
    logger.error('Error fetching dashboard data:', error);
    throw error;
  }
} 