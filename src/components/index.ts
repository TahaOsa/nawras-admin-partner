// Shared UI components
// Examples: Sidebar, MobileNav, Button, Modal, Card, etc.

export { default as Sidebar } from './Sidebar';
export { default as MobileNav } from './MobileNav';
export { default as MobileHeader } from './MobileHeader';
export { default as ErrorBoundary } from './ErrorBoundary';
export { EditExpenseModal } from './EditExpenseModal';
export { DeleteExpenseModal } from './DeleteExpenseModal';
export { ExpenseFiltersComponent } from './ExpenseFilters';
export { QuickSearch } from './QuickSearch';

// Authentication components
export * from './auth';

// Chart components
export {
  MonthlyTrendsChart,
  CategoryBreakdownChart,
  UserComparisonChart,
  BaseChart,
  ChartContainer,
} from './charts';

// Dashboard components
export { default as DashboardCharts } from './dashboard/DashboardCharts';
