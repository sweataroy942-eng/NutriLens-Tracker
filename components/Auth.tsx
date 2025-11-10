
import React, { useState } from 'react';

interface AuthProps {
    onAuthSuccess: () => void;
}

type AuthMode = 'login' | 'signup';

export const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
    const [mode, setMode] = useState<AuthMode>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate a successful login/signup
        onAuthSuccess();
    };
    
    const toggleMode = () => {
        setMode(prevMode => (prevMode === 'login' ? 'signup' : 'login'));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center font-sans">
            <div className="max-w-md w-full mx-auto p-8">
                 <div className="flex items-center justify-center gap-3 mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-deep-teal"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>
                    <h1 className="text-4xl font-bold text-deep-teal">NutriLens</h1>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-md space-y-6">
                    <h2 className="text-2xl font-bold text-center text-gray-700">
                        {mode === 'login' ? 'Welcome Back!' : 'Create Your Account'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1" htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-deep-teal focus:border-deep-teal"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1" htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-deep-teal focus:border-deep-teal"
                                placeholder="••••••••"
                            />
                        </div>
                        <button type="submit" className="w-full bg-deep-teal text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors">
                            {mode === 'login' ? 'Login' : 'Sign Up'}
                        </button>
                    </form>
                    <p className="text-center text-sm text-gray-600">
                        {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
                        <button onClick={toggleMode} className="font-medium text-deep-teal hover:underline">
                             {mode === 'login' ? 'Sign up' : 'Login'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};
