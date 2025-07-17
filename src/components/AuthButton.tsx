import React, { useState, useEffect } from 'react';
import { config } from '../config';

interface AuthStatus {
  authenticated: boolean;
  hasOAuthToken: boolean;
  hasApiKey: boolean;
}

const AuthButton: React.FC = () => {
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.backendUrl}/auth/status`);
      if (response.ok) {
        const status = await response.json();
        setAuthStatus(status);
      } else {
        setError('Failed to check authentication status');
      }
    } catch (error) {
      setError('Error checking authentication status');
      console.error('Auth status check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = () => {
    window.location.href = `${config.backendUrl}/auth/authorize`;
  };

  const handleLogout = async () => {
    // In a real app, you'd clear the token from the server
    // For now, we'll just refresh the page to clear the in-memory token
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Checking authentication...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
        <button 
          onClick={checkAuthStatus}
          className="ml-2 text-red-700 underline hover:no-underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!authStatus) {
    return null;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${authStatus.authenticated ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm">
            {authStatus.authenticated ? 'Authenticated' : 'Not authenticated'}
          </span>
        </div>
        
        {authStatus.hasOAuthToken && (
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2 bg-green-500"></div>
            <span className="text-sm text-green-600">OAuth2 Token Active</span>
          </div>
        )}
        
        {authStatus.hasApiKey && (
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2 bg-blue-500"></div>
            <span className="text-sm text-blue-600">API Key Available</span>
          </div>
        )}
      </div>

      <div className="space-x-4">
        {!authStatus.authenticated ? (
          <button
            onClick={handleOAuthLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Connect with Exist.io (OAuth2)
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Disconnect
          </button>
        )}
        
        <button
          onClick={checkAuthStatus}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Refresh Status
        </button>
      </div>

      {!authStatus.authenticated && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-medium text-yellow-800 mb-2">Setup Instructions:</h3>
          <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
            <li>Go to <a href="https://exist.io/account/apps/" target="_blank" rel="noopener noreferrer" className="underline">Exist.io Apps</a></li>
            <li>Create a new OAuth2 application</li>
            <li>Set the redirect URI to: <code className="bg-yellow-100 px-1 rounded">{config.backendUrl}/auth/callback</code></li>
            <li>Add the client ID and secret to your Railway environment variables</li>
            <li>Click "Connect with Exist.io" above</li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default AuthButton; 