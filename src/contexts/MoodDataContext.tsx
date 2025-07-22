import React, { createContext, useContext, useState, ReactNode } from 'react';
import { apiService, MoodDataPayload, mapMoodToEnum, mapComplexityToEnum, mapSatisfactionToScale } from '@/lib/api';

// Types for the context
interface MoodDataState {
  mood: number | null; // 0-4 index from mood selection
  energyLevel: number | null; // 1-5 from energy clicks
  complexity: number | null; // 1-4 from complexity selection
  satisfactionRatio: number | null; // 0-1 from satisfaction slider
  summary: string; // text from log page
}

interface MoodDataContextType {
  data: MoodDataState;
  setMood: (mood: number) => void;
  setEnergyLevel: (level: number) => void;
  setComplexity: (complexity: number) => void;
  setSatisfactionRatio: (ratio: number) => void;
  setSummary: (summary: string) => void;
  submitData: () => Promise<{ success: boolean; error?: string }>;
  resetData: () => void;
  isComplete: () => boolean;
}

const MoodDataContext = createContext<MoodDataContextType | undefined>(undefined);

// Initial state
const initialState: MoodDataState = {
  mood: null,
  energyLevel: null,
  complexity: null,
  satisfactionRatio: null,
  summary: ''
};

// Provider component
export const MoodDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<MoodDataState>(initialState);

  const setMood = (mood: number) => {
    setData(prev => ({ ...prev, mood }));
  };

  const setEnergyLevel = (energyLevel: number) => {
    setData(prev => ({ ...prev, energyLevel }));
  };

  const setComplexity = (complexity: number) => {
    setData(prev => ({ ...prev, complexity }));
  };

  const setSatisfactionRatio = (satisfactionRatio: number) => {
    setData(prev => ({ ...prev, satisfactionRatio }));
  };

  const setSummary = (summary: string) => {
    setData(prev => ({ ...prev, summary }));
  };

  const resetData = () => {
    setData(initialState);
  };

  const isComplete = () => {
    return (
      data.mood !== null &&
      data.energyLevel !== null &&
      data.complexity !== null &&
      data.satisfactionRatio !== null &&
      data.summary.trim() !== ''
    );
  };

  const submitData = async (): Promise<{ success: boolean; error?: string }> => {
    if (!isComplete()) {
      return { success: false, error: 'Please complete all fields before submitting.' };
    }

    try {
      // Transform the data to match API format
      const payload: MoodDataPayload = {
        summary: data.summary,
        mood: mapMoodToEnum(data.mood!),
        energy_level: data.energyLevel!,
        complexity: mapComplexityToEnum(data.complexity!),
        satisfaction: mapSatisfactionToScale(data.satisfactionRatio!)
      };

      console.log('Submitting mood data:', payload);
      
      const result = await apiService.submitMoodData(payload);
      
      if (result.success) {
        resetData(); // Clear data after successful submission
        return { success: true };
      } else {
        return { success: false, error: 'Failed to submit data to server.' };
      }
    } catch (error) {
      console.error('Error submitting mood data:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Network error occurred.' 
      };
    }
  };

  const value: MoodDataContextType = {
    data,
    setMood,
    setEnergyLevel,
    setComplexity,
    setSatisfactionRatio,
    setSummary,
    submitData,
    resetData,
    isComplete
  };

  return (
    <MoodDataContext.Provider value={value}>
      {children}
    </MoodDataContext.Provider>
  );
};

// Custom hook to use the context
export const useMoodData = (): MoodDataContextType => {
  const context = useContext(MoodDataContext);
  if (!context) {
    throw new Error('useMoodData must be used within a MoodDataProvider');
  }
  return context;
}; 