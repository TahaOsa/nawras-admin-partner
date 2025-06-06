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

    const data: DashboardData = await response.json();
    
    logger.debug('Successfully fetched dashboard data:', data);
    
    return data;
  } catch (error) {
    logger.error('Error fetching dashboard data:', error);
    throw error;
  }
} 