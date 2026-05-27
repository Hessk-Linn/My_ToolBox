import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          background: '#0a0d14',
          color: 'white',
        }}>
          <div style={{
            maxWidth: '500px',
            textAlign: 'center',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚠️</div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '12px', fontWeight: 900 }}>
              Something went wrong
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '24px', fontSize: '0.9rem' }}>
              The app encountered an unexpected error. Please refresh the page to try again.
            </p>
            {this.state.error && (
              <details style={{
                textAlign: 'left',
                background: 'rgba(255,255,255,0.03)',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.5)',
              }}>
                <summary style={{ cursor: 'pointer', marginBottom: '8px', fontWeight: 700 }}>
                  Error details
                </summary>
                <code style={{ wordBreak: 'break-word' }}>
                  {this.state.error.toString()}
                </code>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#ff9800',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
