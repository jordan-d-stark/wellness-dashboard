import { WellnessData } from '../types';

// Types for Exist.io API responses
interface ExistAttribute {
  id: number;
  name: string;
  value: number;
  date: string;
  group: string;
}

interface ExistApiResponse {
  attributes: ExistAttribute[];
}

// API configuration
const EXIST_API_BASE_URL = 'https://exist.io/api/1';
const CORS_PROXY = 'https://thingproxy.freeboard.io/fetch/';
const API_KEY = process.env.REACT_APP_EXIST_API_KEY;

// Helper function to format date for API requests
const formatDateForAPI = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Helper function to get date range for past 7 days
const getDateRange = () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 6);
  
  return {
    start: formatDateForAPI(startDate),
    end: formatDateForAPI(endDate),
  };
};

// Fetch wellness data from our backend server
export const fetchWellnessData = async (): Promise<WellnessData> => {
  try {
    console.log('Fetching data from backend server...');
    
    const response = await fetch('http://localhost:3001/api/wellness-data');
    
    console.log('Backend response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Data received from backend:', data);
    
    return data;
  } catch (error) {
    console.error('Error fetching data from backend:', error);
    throw error;
  }
};

// Check if user is authenticated
export const checkAuthStatus = async (): Promise<boolean> => {
  if (!API_KEY) {
    return false;
  }

  try {
    const response = await fetch(`${EXIST_API_BASE_URL}/users/$self/`, {
      headers: {
        'Authorization': `Token ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error checking auth status:', error);
    return false;
  }
};

// Get user profile information
export const getUserProfile = async () => {
  if (!API_KEY) {
    throw new Error('API key not found');
  }

  try {
    const response = await fetch(`${EXIST_API_BASE_URL}/users/$self/`, {
      headers: {
        'Authorization': `Token ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}; 