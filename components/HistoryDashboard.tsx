
import React, { useState } from 'react';
import { type NutrientGoals, type NutrientTotals } from '../types';
import { DailyProgress } from './DailyProgress';

interface HistoryDashboardProps {
  history: Record<string, NutrientTotals>;
  goals: NutrientGoals;
}

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const EMPTY_TOTALS: NutrientTotals = {
  calories: 0,
  protein: 0,
  fat: 0,
  fiber: 0,
  water: 0,
};

export const HistoryDashboard: React.FC<HistoryDashboardProps> = ({ history, goals }) => {
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };
  
  const totalsForSelectedDate = history[selectedDate] || EMPTY_TOTALS;
  const hasData = history[selectedDate];

  return (
    <div className="space-y-4 animate-fade-in">
        <div>
            <label htmlFor="history-date" className="block text-sm font-medium text-gray-600 mb-1">
                Select a date to view:
            </label>
            <input 
                type="date"
                id="history-date"
                value={selectedDate}
                max={getTodayDateString()}
                onChange={handleDateChange}
                className="w-full p-2 rounded-md bg-gray-700 text-white border-gray-600 shadow-sm focus:border-light-green focus:ring focus:ring-light-green focus:ring-opacity-50"
                style={{ colorScheme: 'dark' }}
            />
        </div>

        {hasData ? (
            <DailyProgress
                goals={goals}
                dailyTotals={totalsForSelectedDate}
                onWaterChange={() => {}} // No-op for history
                isReadOnly={true}
            />
        ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No data recorded for this day.</p>
            </div>
        )}
    </div>
  );
};
