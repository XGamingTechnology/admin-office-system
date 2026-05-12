import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-8">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full border border-red-200">
            <h2 className="text-xl font-bold text-red-600 mb-4">⚠️ Something went wrong</h2>
            <pre className="bg-gray-100 p-3 rounded text-sm text-gray-800 overflow-auto max-h-60">{this.state.error?.toString()}</pre>
            <p className="text-sm text-gray-500 mt-4">Check browser console (F12) for more details.</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
