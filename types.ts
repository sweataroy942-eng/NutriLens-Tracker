
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum ActivityLevel {
  SEDENTARY = 'SEDENTARY',
  LIGHT = 'LIGHT',
  MODERATE = 'MODERATE',
  ACTIVE = 'ACTIVE',
  VERY_ACTIVE = 'VERY_ACTIVE',
}

export enum FitnessGoal {
    MAINTENANCE = 'MAINTENANCE',
    FAT_LOSS = 'FAT_LOSS',
    MUSCLE_GAIN = 'MUSCLE_GAIN',
    WEIGHT_GAIN = 'WEIGHT_GAIN',
}

export interface Biometrics {
  weight: number;
  height: number;
  age: number;
  gender: Gender;
  activityLevel: ActivityLevel;
  fitnessGoal: FitnessGoal;
}

export interface NutrientGoals {
  calories: number;
  protein: number;
  fat: number;
  fiber: number;
  water: number; // in glasses
}

export interface NutrientTotals extends Omit<NutrientGoals, 'water'> {
  water: number;
}

export interface AnalyzedFood {
  name: string;
  quantity: string;
}

export interface MealAnalysisResult {
  foods: AnalyzedFood[];
  totalNutrients: {
    calories: number;
    protein: number;
    fat: number;
    fiber: number;
  };
  summary: string;
}
