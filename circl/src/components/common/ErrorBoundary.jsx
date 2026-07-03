import React from 'react';
import { AlertTriangle, WifiOff, RefreshCw, FileQuestion } from 'lucide-react';
import Button from './Button';
import useTranslation from '@i18n/useTranslation';

// Error Boundary Class Component
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    // TODO: Log to Firestore errors collection
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorDisplay
          title="Something went wrong"
          message="An unexpected error occurred. Please try refreshing."
          onRetry={() => this.setState({ hasError: false, error: null })}
        />
      );
    }
    return this.props.children;
  }
}

// Reusable error display
export const ErrorDisplay = ({ title, message, onRetry, icon: Icon = AlertTriangle }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
      <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-danger" />
      </div>
      <h3 className="text-headline-sm font-semibold text-on-surface mb-2">{title}</h3>
      <p className="text-body-md text-text-muted mb-6 max-w-xs">{message}</p>
      {onRetry && (
        <Button variant="primary" icon={RefreshCw} onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};

// Empty state component
export const EmptyState = ({ icon: Icon = FileQuestion, title, message, action, actionLabel }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[250px]">
      <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-4">
        <Icon className="w-10 h-10 text-primary/40" />
      </div>
      <h3 className="text-headline-sm font-semibold text-on-surface mb-2">{title}</h3>
      <p className="text-body-md text-text-muted mb-6 max-w-xs">{message}</p>
      {action && actionLabel && (
        <Button variant="primary" onClick={action}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

// Offline banner
export const OfflineBanner = () => {
  const { t } = useTranslation();

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] bg-amber-500 text-white text-center py-2 px-4 flex items-center justify-center gap-2 animate-slide-down">
      <WifiOff className="w-4 h-4" />
      <span className="text-label-md font-semibold">{t('noInternet')}</span>
    </div>
  );
};

// Toast notification
export const Toast = ({ message, type = 'info' }) => {
  const bgColors = {
    info: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-danger',
  };

  return (
    <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[150] ${bgColors[type]} text-white px-6 py-3 rounded-full shadow-lg animate-fade-in-up text-body-md font-medium`}>
      {message}
    </div>
  );
};

export default ErrorBoundary;
