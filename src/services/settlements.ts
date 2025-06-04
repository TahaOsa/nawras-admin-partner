// Settlement API service functions
import type {
  Settlement,
  SettlementListResponse,
  SettlementResponse,
  CreateSettlementRequest
} from '../types';
import { config } from '../lib/config';

// API base URL from configuration
const API_BASE_URL = config.apiBaseUrl;

/**
 * Fetch all settlements with optional filters
 */
export async function fetchSettlements(filters?: { paidBy?: string; paidTo?: string; limit?: number }): Promise<Settlement[]> {
  const params = new URLSearchParams();

  if (filters?.paidBy) {
    params.append('paidBy', filters.paidBy);
  }

  if (filters?.paidTo) {
    params.append('paidTo', filters.paidTo);
  }

  if (filters?.limit) {
    params.append('limit', filters.limit.toString());
  }

  const url = `${API_BASE_URL}/settlements${params.toString() ? `?${params.toString()}` : ''}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch settlements: ${response.status} ${response.statusText}`);
  }

  const data: SettlementListResponse = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch settlements');
  }

  return data.data;
}

/**
 * Fetch a single settlement by ID
 */
export async function fetchSettlementById(id: number): Promise<Settlement> {
  const response = await fetch(`${API_BASE_URL}/settlements/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch settlement: ${response.status} ${response.statusText}`);
  }

  const data: SettlementResponse = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch settlement');
  }

  return data.data;
}

/**
 * Create a new settlement
 */
export async function createSettlement(settlement: CreateSettlementRequest): Promise<Settlement> {
  const response = await fetch(`${API_BASE_URL}/settlements`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settlement),
  });

  if (!response.ok) {
    throw new Error(`Failed to create settlement: ${response.status} ${response.statusText}`);
  }

  const data: SettlementResponse = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Failed to create settlement');
  }

  return data.data;
}
