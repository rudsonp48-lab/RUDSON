
import { AppData } from '../types';

const API_URL = '/api/data';

export const loadAppData = async (): Promise<AppData> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch data');
    return await response.json();
  } catch (error) {
    console.error('Error loading app data:', error);
    // Fallback to local storage or default data if needed, but here we expect the server to work
    throw error;
  }
};

export const saveAppData = async (data: AppData): Promise<void> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to save data');
  } catch (error) {
    console.error('Error saving app data:', error);
    throw error;
  }
};
