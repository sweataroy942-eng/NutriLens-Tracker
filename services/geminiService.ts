import { GoogleGenAI, Type } from "@google/genai";
import { type MealAnalysisResult } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a placeholder. Please provide a valid API key for the app to function.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "YOUR_API_KEY" });

const nutritionSchema = {
  type: Type.OBJECT,
  properties: {
    foods: {
      type: Type.ARRAY,
      description: "List of recognized food items.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Name of the food item." },
          quantity: { type: Type.STRING, description: "Estimated quantity (e.g., 1 cup, 100g)." }
        },
        required: ["name", "quantity"],
      }
    },
    totalNutrients: {
      type: Type.OBJECT,
      description: "Total nutritional values for the entire meal.",
      properties: {
        calories: { type: Type.NUMBER, description: "Total calories (kcal)." },
        protein: { type: Type.NUMBER, description: "Total protein in grams." },
        fat: { type: Type.NUMBER, description: "Total fat in grams." },
        fiber: { type: Type.NUMBER, description: "Total fiber in grams." }
      },
      required: ["calories", "protein", "fat", "fiber"],
    },
    summary: {
      type: Type.STRING,
      description: "A short, encouraging summary message about the meal's nutritional profile."
    }
  },
  required: ["foods", "totalNutrients", "summary"],
};


export const analyzeMealWithImage = async (base64Image: string, mimeType: string): Promise<MealAnalysisResult> => {
  try {
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType,
      },
    };

    const textPart = {
      text: "Analyze the food items in this image. For each item, estimate its quantity. Provide the total nutritional breakdown for the entire meal for these nutrients: calories, protein, fat, and fiber. Also, provide a short, encouraging summary message. Respond in the requested JSON format.",
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: nutritionSchema,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result as MealAnalysisResult;
  } catch (error) {
    console.error("Error analyzing meal with Gemini:", error);
    throw new Error("Failed to analyze meal. The AI model could not process the image.");
  }
};

export const analyzeMealWithText = async (mealDescription: string): Promise<MealAnalysisResult> => {
  try {
    const textPart = {
      text: `Analyze the food items in this description: "${mealDescription}". For each item, estimate its quantity if not specified. Provide the total nutritional breakdown for the entire meal for these nutrients: calories, protein, fat, and fiber. Also, provide a short, encouraging summary message. Respond in the requested JSON format.`,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: nutritionSchema,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result as MealAnalysisResult;
  } catch (error) {
    console.error("Error analyzing meal with Gemini:", error);
    throw new Error("Failed to analyze meal. The AI model could not process the text.");
  }
};
