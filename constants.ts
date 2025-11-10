
import { ActivityLevel, Gender, FitnessGoal, type NutrientGoals } from './types';

export const ACTIVITY_FACTORS: { [key in ActivityLevel]: number } = {
  [ActivityLevel.SEDENTARY]: 1.2,
  [ActivityLevel.LIGHT]: 1.375,
  [ActivityLevel.MODERATE]: 1.55,
  [ActivityLevel.ACTIVE]: 1.725,
  [ActivityLevel.VERY_ACTIVE]: 1.9,
};

export const GOAL_MACROS: { [key in FitnessGoal]: { protein: number; fat: number } } = {
  [FitnessGoal.MAINTENANCE]: { protein: 0.30, fat: 0.25 },
  [FitnessGoal.FAT_LOSS]: { protein: 0.40, fat: 0.25 },
  [FitnessGoal.MUSCLE_GAIN]: { protein: 0.35, fat: 0.30 },
  [FitnessGoal.WEIGHT_GAIN]: { protein: 0.25, fat: 0.35 },
};

export const GOAL_CALORIE_MODIFIERS: { [key in FitnessGoal]: number } = {
    [FitnessGoal.MAINTENANCE]: 0,
    [FitnessGoal.FAT_LOSS]: -500,
    [FitnessGoal.MUSCLE_GAIN]: 300,
    [FitnessGoal.WEIGHT_GAIN]: 500,
};

export const DEFAULT_GOALS: NutrientGoals = {
  calories: 2000,
  protein: 150,
  fat: 65,
  fiber: 30,
  water: 8,
};

export const DEFAULT_BIOMETRICS = {
    weight: 70,
    height: 170,
    age: 30,
    gender: Gender.MALE,
    activityLevel: ActivityLevel.MODERATE,
    fitnessGoal: FitnessGoal.MAINTENANCE,
};
