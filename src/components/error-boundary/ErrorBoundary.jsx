//GLOBAL ERROR HANDLER
// This component is used to catch errors globally in the application.
// It wraps the entire application and provides a fallback UI in case of errors.
// It also logs the error to the console for debugging purposes.
// It is used in the main App component to ensure that any errors in the application are caught and handled gracefully.

import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('React render error:', error, info);
  }
  render() {
    const { hasError, error } = this.state;
    if (hasError) {
      return (
        <div style={{ padding: 24 }}>
          <h2>Something went wrong.</h2>
          {process.env.NODE_ENV !== 'production' && <pre style={{ whiteSpace: 'pre-wrap' }}>{String(error?.stack || error?.message)}</pre>}
        </div>
      );
    }
    return this.props.children;
  }
}
