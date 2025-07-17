import { WellnessData } from '../types';

// Mock data that represents what Exist.io data might look like
// Data is already sorted chronologically (Jul 11 to Jul 17)
export const mockWellnessData: WellnessData = {
  steps: [
    { date: 'Jul 11', value: 8420, unit: 'steps' },
    { date: 'Jul 12', value: 10234, unit: 'steps' },
    { date: 'Jul 13', value: 7891, unit: 'steps' },
    { date: 'Jul 14', value: 11567, unit: 'steps' },
    { date: 'Jul 15', value: 9234, unit: 'steps' },
    { date: 'Jul 16', value: 8765, unit: 'steps' },
    { date: 'Jul 17', value: 10987, unit: 'steps' },
  ],
  sleep: [
    { date: 'Jul 11', value: 7.5, unit: 'hours' },
    { date: 'Jul 12', value: 6.8, unit: 'hours' },
    { date: 'Jul 13', value: 8.2, unit: 'hours' },
    { date: 'Jul 14', value: 7.1, unit: 'hours' },
    { date: 'Jul 15', value: 6.5, unit: 'hours' },
    { date: 'Jul 16', value: 8.0, unit: 'hours' },
    { date: 'Jul 17', value: 7.3, unit: 'hours' },
  ],
  meditation: [
    { date: 'Jul 11', value: 15, unit: 'minutes' },
    { date: 'Jul 12', value: 0, unit: 'minutes' },
    { date: 'Jul 13', value: 20, unit: 'minutes' },
    { date: 'Jul 14', value: 10, unit: 'minutes' },
    { date: 'Jul 15', value: 0, unit: 'minutes' },
    { date: 'Jul 16', value: 25, unit: 'minutes' },
    { date: 'Jul 17', value: 15, unit: 'minutes' },
  ],
  productivity: [
    { date: 'Jul 11', value: 6.5, unit: 'hours' },
    { date: 'Jul 12', value: 8.2, unit: 'hours' },
    { date: 'Jul 13', value: 7.1, unit: 'hours' },
    { date: 'Jul 14', value: 5.8, unit: 'hours' },
    { date: 'Jul 15', value: 9.0, unit: 'hours' },
    { date: 'Jul 16', value: 6.7, unit: 'hours' },
    { date: 'Jul 17', value: 7.8, unit: 'hours' },
  ],
};

// Common Exist.io attribute names that might be available
export const commonExistAttributes = [
  // Activity/Health
  'steps',
  'distance',
  'calories',
  'active_minutes',
  'heart_rate',
  
  // Sleep
  'sleep_hours',
  'sleep_quality',
  'sleep_efficiency',
  'bedtime',
  'wake_time',
  
  // Mood
  'mood',
  'happiness',
  'stress',
  'energy',
  
  // Productivity
  'productivity',
  'focus_time',
  'work_hours',
  'breaks',
  
  // Fitness
  'workouts',
  'exercise_minutes',
  'strength_training',
  'cardio',
  
  // Custom
  'meditation',
  'reading',
  'social_time',
  'screen_time',
];

// Example of what the API response might look like
export const exampleApiResponse = {
  objects: [
    { name: 'steps', label: 'Steps', group: 'activity' },
    { name: 'sleep_hours', label: 'Sleep Hours', group: 'sleep' },
    { name: 'mood', label: 'Mood', group: 'mood' },
    { name: 'productivity', label: 'Productivity', group: 'productivity' },
    { name: 'meditation', label: 'Meditation', group: 'custom' },
  ]
}; 