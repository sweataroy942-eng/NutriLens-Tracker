
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { type NutrientGoals, type NutrientTotals } from '../types';

interface DailyProgressProps {
  goals: NutrientGoals;
  dailyTotals: NutrientTotals;
  onWaterChange: (amount: number) => void;
  isReadOnly?: boolean;
}

const ProgressRing: React.FC<{ value: number; goal: number; name: string; color: string; unit: string }> = ({ value, goal, name, color, unit }) => {
    const progress = goal > 0 ? Math.min(Math.round((value / goal) * 100), 100) : 0;
    const data = [{ name: 'value', value: progress }, { name: 'remaining', value: 100 - progress }];
    return (
        <div className="flex flex-col items-center">
            <div className="w-24 h-24 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={data} dataKey="value" cx="50%" cy="50%" innerRadius={30} outerRadius={40} startAngle={90} endAngle={-270} paddingAngle={0} cornerRadius={5}>
                             <Cell key="value" fill={color} />
                             <Cell key="remaining" fill="#e5e7eb" />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-700">{progress}%</span>
                </div>
            </div>
            <p className="text-sm font-semibold mt-2 text-gray-600">{name}</p>
            <p className="text-xs text-gray-500">{`${Math.round(value)} / ${goal}${unit}`}</p>
        </div>
    );
};

const WaterTracker: React.FC<{ count: number; goal: number; onWaterChange: (amount: number) => void; isReadOnly?: boolean; }> = ({ count, goal, onWaterChange, isReadOnly }) => {
    return (
        <div className="mt-4">
            <h4 className="font-semibold text-gray-600 mb-2">Water Intake</h4>
            <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                <div className="flex items-center gap-4">
                     <button onClick={() => onWaterChange(-1)} className="bg-white rounded-full p-1 shadow hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed" disabled={isReadOnly || count <= 0}>-</button>
                     <span className="font-bold text-lg text-deep-teal">{count} / {goal} glasses</span>
                     <button onClick={() => onWaterChange(1)} className="bg-white rounded-full p-1 shadow hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed" disabled={isReadOnly}>+</button>
                </div>
                 <div className="flex gap-1 items-center">
                    {[...Array(goal)].map((_, i) => {
                        const isFilled = i < count;
                        const glassClasses = `
                            w-5 h-5 
                            transition-all duration-300 ease-out
                            ${isFilled ? 'text-deep-teal scale-110' : 'text-gray-300 scale-100'}
                        `;
                        return (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={glassClasses}>
                                <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm0 1.5a8.25 8.25 0 110 16.5 8.25 8.25 0 010-16.5z" fillOpacity={isFilled ? 0.2 : 0} />
                                <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75" />
                            </svg>
                        );
                    })}
                 </div>
            </div>
        </div>
    )
};

export const DailyProgress: React.FC<DailyProgressProps> = ({ goals, dailyTotals, onWaterChange, isReadOnly = false }) => {
    return (
        <div className="animate-fade-in space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ProgressRing value={dailyTotals.calories} goal={goals.calories} name="Calories" color="#008080" unit="kcal" />
                <ProgressRing value={dailyTotals.protein} goal={goals.protein} name="Protein" color="#008080" unit="g" />
                <ProgressRing value={dailyTotals.fat} goal={goals.fat} name="Fat" color="#008080" unit="g" />
                <ProgressRing value={dailyTotals.fiber} goal={goals.fiber} name="Fiber" color="#008080" unit="g" />
            </div>
            <WaterTracker count={dailyTotals.water} goal={goals.water} onWaterChange={onWaterChange} isReadOnly={isReadOnly} />
        </div>
    );
};
