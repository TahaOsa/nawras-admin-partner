// Category-related TypeScript type definitions

export interface Category {
  id: string;
  name: string;
  color: string; // hex color code
  icon: string; // icon name or emoji
  isDefault: boolean; // whether it's a system default category
  createdAt: string;
}

// For creating new categories
export interface CreateCategoryRequest {
  name: string;
  color: string;
  icon: string;
}

// For updating categories
export interface UpdateCategoryRequest {
  name?: string;
  color?: string;
  icon?: string;
}

// API response wrapper for categories
export interface CategoryResponse {
  success: boolean;
  data: Category;
  timestamp?: string;
}

// API response wrapper for category lists
export interface CategoryListResponse {
  success: boolean;
  data: Category[];
  total: number;
  timestamp?: string;
}

// Default categories with predefined colors and icons
export const DEFAULT_CATEGORIES: Omit<Category, 'id' | 'createdAt'>[] = [
  {
    name: 'Food',
    color: '#ef4444', // red-500
    icon: '🍽️',
    isDefault: true
  },
  {
    name: 'Groceries',
    color: '#22c55e', // green-500
    icon: '🛒',
    isDefault: true
  },
  {
    name: 'Transportation',
    color: '#3b82f6', // blue-500
    icon: '🚗',
    isDefault: true
  },
  {
    name: 'Utilities',
    color: '#f59e0b', // amber-500
    icon: '⚡',
    isDefault: true
  },
  {
    name: 'Entertainment',
    color: '#8b5cf6', // violet-500
    icon: '🎬',
    isDefault: true
  },
  {
    name: 'Healthcare',
    color: '#ec4899', // pink-500
    icon: '🏥',
    isDefault: true
  },
  {
    name: 'Shopping',
    color: '#06b6d4', // cyan-500
    icon: '🛍️',
    isDefault: true
  },
  {
    name: 'Travel',
    color: '#84cc16', // lime-500
    icon: '✈️',
    isDefault: true
  },
  {
    name: 'Other',
    color: '#6b7280', // gray-500
    icon: '📝',
    isDefault: true
  }
];
