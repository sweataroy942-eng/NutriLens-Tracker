import React, { useState, useCallback } from 'react';
import { analyzeMealWithText } from '../services/geminiService';
import { type MealAnalysisResult } from '../types';

// ===================================
// Shared Components
// ===================================

export const Loader = () => (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep-teal"></div>
        <p className="text-deep-teal font-medium">Analyzing your meal...</p>
    </div>
);

interface MealResultProps {
    lastMeal: MealAnalysisResult | null;
}

export const MealResult: React.FC<MealResultProps> = ({ lastMeal }) => {
    if (!lastMeal) {
        return null;
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-md animate-fade-in">
            <h3 className="text-xl font-bold text-gray-700 mb-4">Analysis Result</h3>
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4">
                <p className="text-gray-800 italic">"{lastMeal.summary}"</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-center">
                <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Calories</p>
                    <p className="text-lg font-bold text-deep-teal">{Math.round(lastMeal.totalNutrients.calories)}</p>
                </div>
                 <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Protein</p>
                    <p className="text-lg font-bold text-deep-teal">{Math.round(lastMeal.totalNutrients.protein)}g</p>
                </div>
                 <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Fat</p>
                    <p className="text-lg font-bold text-deep-teal">{Math.round(lastMeal.totalNutrients.fat)}g</p>
                </div>
                 <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Fiber</p>
                    <p className="text-lg font-bold text-deep-teal">{Math.round(lastMeal.totalNutrients.fiber)}g</p>
                </div>
            </div>
            
            <div>
                <h4 className="font-semibold text-gray-600 mb-2">Recognized Items:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                   {lastMeal.foods.map((food, index) => (
                       <li key={index}>
                           <span className="font-medium">{food.name}</span> - <span className="text-sm italic">{food.quantity}</span>
                       </li>
                   ))}
                </ul>
            </div>
        </div>
    );
};

// ===================================
// Manual Meal Entry Component
// ===================================

interface ManualMealEntryProps {
    onMealAnalyzed: (result: MealAnalysisResult) => void;
    setIsLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    isLoading: boolean;
}

const TextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 6.1H3"/><path d="M21 12.1H3"/><path d="M15.1 18H3"/></svg>;

export const ManualMealEntry: React.FC<ManualMealEntryProps> = ({ onMealAnalyzed, setIsLoading, setError, isLoading }) => {
    const [mealDescription, setMealDescription] = useState('');

    const handleAnalyze = useCallback(async () => {
        if (!mealDescription.trim()) {
            setError("Please enter a description of your meal.");
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const result = await analyzeMealWithText(mealDescription);
            onMealAnalyzed(result);
            setMealDescription(''); // Clear textarea on success
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, [mealDescription, setIsLoading, setError, onMealAnalyzed]);
    
    return (
        <div className="animate-fade-in space-y-4">
            <div>
                <label htmlFor="meal-description" className="block text-sm font-medium text-gray-600 mb-2">
                    Describe your meal (e.g., "A bowl of oatmeal with blueberries and a glass of orange juice"):
                </label>
                <textarea
                    id="meal-description"
                    rows={4}
                    value={mealDescription}
                    onChange={(e) => setMealDescription(e.target.value)}
                    placeholder="Enter meal details here..."
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-deep-teal focus:border-deep-teal"
                />
            </div>
            <button
                onClick={handleAnalyze}
                disabled={isLoading || !mealDescription.trim()}
                className="w-full flex items-center justify-center gap-2 bg-deep-teal text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                <TextIcon />
                {isLoading ? 'Analyzing...' : 'Analyze Meal'}
            </button>
        </div>
    );
};
