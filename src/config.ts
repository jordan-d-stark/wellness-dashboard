// Configuration for different environments
export const config = {
  // Backend URL - will be set by environment variable in production
  backendUrl: process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001',
  
  // Exist.io API configuration
  existApiKey: process.env.REACT_APP_EXIST_API_KEY,
  
  // Environment
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
};

// Log configuration in development
if (config.isDevelopment) {
  console.log('App Configuration:', {
    backendUrl: config.backendUrl,
    isProduction: config.isProduction,
    hasApiKey: !!config.existApiKey,
  });
} 