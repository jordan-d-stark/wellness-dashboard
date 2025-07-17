// Configuration for different environments
export const config = {
  // Backend URL - use Railway URL in production, localhost in development
  backendUrl: process.env.NODE_ENV === 'production' 
    ? 'https://web-production-7823a.up.railway.app'
    : (process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001'),
  
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