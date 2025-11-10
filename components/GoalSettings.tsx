
import React, { useState, useEffect } from 'react';
import { ActivityLevel, Gender, FitnessGoal, type Biometrics, type NutrientGoals } from '../types';
import { ACTIVITY_FACTORS, DEFAULT_BIOMETRICS, GOAL_MACROS, GOAL_CALORIE_MODIFIERS } from '../constants';

interface GoalSettingsProps {
  setGoals: (goals: NutrientGoals) => void;
}

const calculateGoals = (biometrics: Biometrics): NutrientGoals => {
    const { weight, height, age, gender, activityLevel, fitnessGoal } = biometrics;
    let bmr: number;
    if (gender === Gender.MALE) {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const tdee = bmr * ACTIVITY_FACTORS[activityLevel];
    const calorieModifier = GOAL_CALORIE_MODIFIERS[fitnessGoal];
    const calories = Math.round(tdee + calorieModifier);
    
    const macros = GOAL_MACROS[fitnessGoal];
    const protein = Math.round((calories * macros.protein) / 4);
    const fat = Math.round((calories * macros.fat) / 9);
    
    return {
        calories,
        protein,
        fat,
        fiber: 30, // Standard recommendation
        water: 8, // Standard recommendation
    };
};

export const GoalSettings: React.FC<GoalSettingsProps> = ({ setGoals }) => {
    const [biometrics, setBiometrics] = useState<Biometrics>(() => {
        const savedBiometrics = localStorage.getItem('nutrilens-biometrics');
        const parsed = savedBiometrics ? JSON.parse(savedBiometrics) : DEFAULT_BIOMETRICS;
        // Backwards compatibility for users without the new goal set
        if (!parsed.fitnessGoal) {
            parsed.fitnessGoal = DEFAULT_BIOMETRICS.fitnessGoal;
        }
        return parsed;
    });

    useEffect(() => {
        localStorage.setItem('nutrilens-biometrics', JSON.stringify(biometrics));
    }, [biometrics]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setBiometrics(prev => ({ ...prev, [name]: name === 'gender' || name === 'activityLevel' || name === 'fitnessGoal' ? value : parseFloat(value) || 0 }));
    };

    const handleSetGoals = () => {
        const newGoals = calculateGoals(biometrics);
        setGoals(newGoals);
    };
    
    const inputStyles = "mt-1 block w-full rounded-md bg-gray-700 text-white border-gray-600 shadow-sm focus:border-light-green focus:ring focus:ring-light-green focus:ring-opacity-50 sm:text-sm p-2";

    return (
        <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
            <h2 className="text-xl font-bold text-gray-700">Set Your Goals</h2>
            <p className="text-sm text-gray-500">Update your biometrics to get personalized daily goals.</p>
            
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Weight (kg)</label>
                        <input type="number" name="weight" value={biometrics.weight} onChange={handleInputChange} className={inputStyles} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Height (cm)</label>
                        <input type="number" name="height" value={biometrics.height} onChange={handleInputChange} className={inputStyles} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Age</label>
                        <input type="number" name="age" value={biometrics.age} onChange={handleInputChange} className={inputStyles} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Gender</label>
                        <select name="gender" value={biometrics.gender} onChange={handleInputChange} className={inputStyles}>
                            <option value={Gender.MALE}>Male</option>
                            <option value={Gender.FEMALE}>Female</option>
                        </select>
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-600">Activity Level</label>
                    <select name="activityLevel" value={biometrics.activityLevel} onChange={handleInputChange} className={inputStyles}>
                       {Object.entries(ActivityLevel).map(([key, value]) => (
                           <option key={key} value={value}>{key.charAt(0) + key.slice(1).toLowerCase().replace('_', ' ')}</option>
                       ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600">Fitness Goal</label>
                    <select name="fitnessGoal" value={biometrics.fitnessGoal} onChange={handleInputChange} className={inputStyles}>
                       {Object.entries(FitnessGoal).map(([key, value]) => (
                           <option key={key} value={value}>{key.charAt(0) + key.slice(1).toLowerCase().replace(/_/g, ' ')}</option>
                       ))}
                    </select>
                </div>
                <button onClick={handleSetGoals} className="w-full bg-deep-teal text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors">
                    Update My Goals
                </button>
            </div>
        </div>
    );
};
