import React, { useState, useEffect } from 'react';
import { GoalSettings } from './components/GoalSettings';
import { DailyProgress } from './components/DailyProgress';
import { MealAnalysis } from './components/MealAnalysis';
import { Auth } from './components/Auth';
import { HistoryDashboard } from './components/HistoryDashboard';
import { ManualMealEntry, MealResult, Loader } from './components/GoalsDashboard';
import { type NutrientGoals, type MealAnalysisResult, type NutrientTotals } from './types';
import { DEFAULT_GOALS } from './constants';

const Header = ({ onLogout }: { onLogout: () => void }) => (
  <header className="bg-white shadow-md p-4 w-full">
    <div className="container mx-auto flex items-center justify-between">
      <div className="flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-deep-teal"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>
        <h1 className="text-2xl font-bold text-deep-teal">NutriLens</h1>
      </div>
      <button onClick={onLogout} className="bg-deep-teal text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors text-sm">
        Logout
      </button>
    </div>
  </header>
);

const getTodayDateString = () => new Date().toISOString().split('T')[0];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [goals, setGoals] = useState<NutrientGoals>(() => {
    const savedGoals = localStorage.getItem('nutrilens-goals');
    return savedGoals ? JSON.parse(savedGoals) : DEFAULT_GOALS;
  });
  const [dailyTotals, setDailyTotals] = useState<NutrientTotals>({ calories: 0, protein: 0, fat: 0, fiber: 0, water: 0 });
  const [history, setHistory] = useState<Record<string, NutrientTotals>>(() => {
    const savedHistory = localStorage.getItem('nutrilens-history');
    return savedHistory ? JSON.parse(savedHistory) : {};
  });
  const [lastMeal, setLastMeal] = useState<MealAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'today' | 'history'>('today');
  const [analysisMode, setAnalysisMode] = useState<'photo' | 'text'>('photo');

  // Effect for initialization and daily reset
  useEffect(() => {
    const today = getTodayDateString();
    const lastDate = localStorage.getItem('nutrilens-lastDate');
    
    if (lastDate === today) {
      // It's the same day, load today's totals
      const savedTotals = localStorage.getItem('nutrilens-dailyTotals');
      if (savedTotals) {
        setDailyTotals(JSON.parse(savedTotals));
      }
    } else {
      // It's a new day, reset totals
      setDailyTotals({ calories: 0, protein: 0, fat: 0, fiber: 0, water: 0 });
      localStorage.setItem('nutrilens-dailyTotals', JSON.stringify({ calories: 0, protein: 0, fat: 0, fiber: 0, water: 0 }));
    }
    localStorage.setItem('nutrilens-lastDate', today);
  }, []);

  // Effect to save data whenever it changes
  useEffect(() => {
    const today = getTodayDateString();
    localStorage.setItem('nutrilens-dailyTotals', JSON.stringify(dailyTotals));
    
    // Don't save empty data to history
    // Fix: Add type guard to ensure val is a number before comparison, resolving TypeScript error.
    const isDataPresent = Object.values(dailyTotals).some(val => typeof val === 'number' && val > 0);
    if (isDataPresent) {
      setHistory(prevHistory => {
        const newHistory = { ...prevHistory, [today]: dailyTotals };
        localStorage.setItem('nutrilens-history', JSON.stringify(newHistory));
        return newHistory;
      });
    }
  }, [dailyTotals]);

  // Effect to save goals
  useEffect(() => {
    localStorage.setItem('nutrilens-goals', JSON.stringify(goals));
  }, [goals]);

  const handleMealAnalyzed = (mealData: MealAnalysisResult) => {
    setDailyTotals(prevTotals => ({
      ...prevTotals,
      calories: prevTotals.calories + mealData.totalNutrients.calories,
      protein: prevTotals.protein + mealData.totalNutrients.protein,
      fat: prevTotals.fat + mealData.totalNutrients.fat,
      fiber: prevTotals.fiber + mealData.totalNutrients.fiber,
    }));
    setLastMeal(mealData);
    setError(null);
  };

  const handleWaterChange = (amount: number) => {
    setDailyTotals(prev => ({
      ...prev,
      water: Math.max(0, prev.water + amount)
    }));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    // Optionally clear data on logout
    // localStorage.clear();
  };

  if (!isAuthenticated) {
    return <Auth onAuthSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col items-center">
      <Header onLogout={handleLogout} />
      <main className="container mx-auto p-4 md:p-6 lg:p-8 w-full flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Log Your Meal</h2>
                <div className="flex border-b border-gray-200 mb-4">
                    <button 
                      onClick={() => setAnalysisMode('photo')}
                      className={`py-2 px-4 text-sm font-medium transition-colors ${analysisMode === 'photo' ? 'border-b-2 border-deep-teal text-deep-teal' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      From Photo
                    </button>
                    <button 
                      onClick={() => setAnalysisMode('text')}
                      className={`py-2 px-4 text-sm font-medium transition-colors ${analysisMode === 'text' ? 'border-b-2 border-deep-teal text-deep-teal' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      Manual Entry
                    </button>
                </div>

                {analysisMode === 'photo' ? (
                  <MealAnalysis 
                    onMealAnalyzed={handleMealAnalyzed}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    setError={setError}
                  />
                ) : (
                  <ManualMealEntry 
                    onMealAnalyzed={handleMealAnalyzed}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    setError={setError}
                  />
                )}
            </div>

            {isLoading && <Loader />}

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )}
            
            {!isLoading && !error && lastMeal && (
                <MealResult lastMeal={lastMeal} />
            )}
          </div>
          <div className="lg:col-span-1 space-y-8">
            <GoalSettings setGoals={setGoals} />
            
            <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
              <div className="flex border-b border-gray-200">
                <button 
                  onClick={() => setViewMode('today')}
                  className={`py-2 px-4 text-sm font-medium transition-colors ${viewMode === 'today' ? 'border-b-2 border-deep-teal text-deep-teal' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Today's Progress
                </button>
                <button 
                  onClick={() => setViewMode('history')}
                  className={`py-2 px-4 text-sm font-medium transition-colors ${viewMode === 'history' ? 'border-b-2 border-deep-teal text-deep-teal' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  History
                </button>
              </div>

              {viewMode === 'today' ? (
                <DailyProgress
                  goals={goals}
                  dailyTotals={dailyTotals}
                  onWaterChange={handleWaterChange}
                />
              ) : (
                <HistoryDashboard 
                  history={history}
                  goals={goals}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
