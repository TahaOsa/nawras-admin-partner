// Enhanced error logging and reporting system
import { config, logger } from './config';

export interface ErrorDetails {
  message: string;
  stack?: string;
  context?: Record<string, any>;
  timestamp: string;
  userAgent?: string;
  url?: string;
  userId?: string;
}

class ErrorLogger {
  private errors: ErrorDetails[] = [];
  private maxErrors = 100; // Keep last 100 errors in memory

  logError(error: Error | string, context?: Record<string, any>): void {
    const errorDetails: ErrorDetails = {
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'object' ? error.stack : undefined,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator?.userAgent,
      url: window?.location?.href,
    };

    // Add to in-memory storage
    this.errors.unshift(errorDetails);
    if (this.errors.length > this.maxErrors) {
      this.errors.pop();
    }

    // Log to console
    logger.error('Error logged:', errorDetails);

    // Send to external service if enabled (future enhancement)
    if (config.enableErrorReporting) {
      this.sendToErrorService(errorDetails);
    }
  }

  logApiError(
    url: string, 
    method: string, 
    status: number, 
    statusText: string, 
    responseText?: string
  ): void {
    this.logError(`API Error: ${method} ${url}`, {
      type: 'api_error',
      url,
      method,
      status,
      statusText,
      responseText: responseText?.slice(0, 500), // Limit response text
    });
  }

  logFormError(formName: string, errors: Record<string, string>): void {
    this.logError(`Form validation error: ${formName}`, {
      type: 'form_validation',
      formName,
      validationErrors: errors,
    });
  }

  getRecentErrors(limit: number = 10): ErrorDetails[] {
    return this.errors.slice(0, limit);
  }

  clearErrors(): void {
    this.errors = [];
  }

  private async sendToErrorService(errorDetails: ErrorDetails): Promise<void> {
    try {
      // Future: Send to error reporting service like Sentry, LogRocket, etc.
      // For now, just log that we would send it
      logger.debug('Would send error to reporting service:', errorDetails);
    } catch (e) {
      logger.error('Failed to send error to reporting service:', e);
    }
  }

  // Global error handler setup
  setupGlobalErrorHandlers(): void {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError(`Unhandled Promise Rejection: ${event.reason}`, {
        type: 'unhandled_promise_rejection',
        promise: event.promise,
      });
    });

    // Handle global errors
    window.addEventListener('error', (event) => {
      this.logError(event.error || event.message, {
        type: 'global_error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    // Handle React error boundaries (would need integration)
    if (config.isDevelopment) {
      logger.info('Global error handlers setup complete');
    }
  }
}

// Export singleton instance
export const errorLogger = new ErrorLogger();

// Setup global handlers when module loads
if (typeof window !== 'undefined') {
  errorLogger.setupGlobalErrorHandlers();
}

// Helper functions for common error scenarios
export const logApiError = errorLogger.logApiError.bind(errorLogger);
export const logFormError = errorLogger.logFormError.bind(errorLogger);
export const logError = errorLogger.logError.bind(errorLogger); 