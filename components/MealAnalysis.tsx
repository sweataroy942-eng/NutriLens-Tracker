import React, { useState, useCallback, useRef } from 'react';
import { analyzeMealWithImage } from '../services/geminiService';
import { type MealAnalysisResult } from '../types';

interface MealAnalysisProps {
    onMealAnalyzed: (result: MealAnalysisResult) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

const CameraIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>;

export const MealAnalysis: React.FC<MealAnalysisProps> = ({ onMealAnalyzed, isLoading, setIsLoading, setError }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setError(null);
        }
    };
    
    const fileToBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
      });
    }

    const handleAnalyze = useCallback(async () => {
        if (!selectedFile) {
            setError("Please select an image first.");
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const base64Image = await fileToBase64(selectedFile);
            const result = await analyzeMealWithImage(base64Image, selectedFile.type);
            onMealAnalyzed(result);
            // Reset component to default state after analysis
            setSelectedFile(null);
            setPreviewUrl(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, [selectedFile, setIsLoading, setError, onMealAnalyzed]);

    return (
        <div className="animate-fade-in space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="w-full md:w-1/2">
                    <label htmlFor="meal-photo" className="block text-sm font-medium text-gray-600 mb-2">Upload a photo of your meal:</label>
                    <input ref={fileInputRef} id="meal-photo" type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-deep-teal hover:file:bg-teal-100"/>
                </div>
                {previewUrl && (
                    <div className="w-full md:w-1/2 flex justify-center">
                        <img src={previewUrl} alt="Meal preview" className="mt-2 rounded-lg max-h-48 shadow-sm" />
                    </div>
                )}
            </div>
             <button onClick={handleAnalyze} disabled={isLoading || !selectedFile} className="w-full flex items-center justify-center gap-2 bg-deep-teal text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                <CameraIcon />
                {isLoading ? 'Analyzing...' : 'Analyze Meal'}
            </button>
        </div>
    );
};
