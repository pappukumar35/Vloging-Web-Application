
import React, { useState, useEffect } from 'react';
import { findPlaces } from '../services/geminiService';
import { Location } from '../types';
import Spinner from '../components/Spinner';
import { MapPinIcon } from '@heroicons/react/24/solid';

const Discover: React.FC = () => {
    const [prompt, setPrompt] = useState('What good Italian restaurants are nearby?');
    const [location, setLocation] = useState<Location | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState<{ text: string; groundingChunks: any[] } | null>(null);
    const [locationStatus, setLocationStatus] = useState('Fetching location...');

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
                setLocationStatus('Location acquired successfully.');
            },
            (err) => {
                setError('Could not get location. Please enable location services in your browser.');
                setLocationStatus('Failed to get location. Please enable it and refresh.');
            }
        );
    }, []);

    const handleSearch = async () => {
        if (!prompt.trim()) {
            setError('Please enter something to search for.');
            return;
        }
        setLoading(true);
        setError('');
        setResult(null);
        try {
            const response = await findPlaces(prompt, location);
            setResult(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Discover Places</h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">Let our AI guide you to your next adventure, powered by Google Maps.</p>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic">{locationStatus}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., 'Best coffee shops near me'"
                        className="flex-grow px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                        onClick={handleSearch}
                        disabled={loading || !location}
                        className="w-full sm:w-auto px-6 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </div>

            {error && <p className="text-center text-red-500 bg-red-100 dark:bg-red-900 border border-red-400 p-4 rounded-md">{error}</p>}
            
            {loading && <Spinner />}
            
            {result && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                       {result.text.split('\n').map((line, index) => {
                            if (line.startsWith('* ')) {
                                return <li key={index}>{line.substring(2)}</li>;
                            }
                            return <p key={index}>{line}</p>;
                       })}
                    </div>
                    {result.groundingChunks && result.groundingChunks.length > 0 && (
                        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Sources from Google Maps:</h3>
                            <ul className="space-y-2">
                                {result.groundingChunks.map((chunk, index) => (
                                    chunk.maps && (
                                        <li key={index}>
                                            <a 
                                                href={chunk.maps.uri} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="flex items-center text-indigo-600 dark:text-indigo-400 hover:underline"
                                            >
                                                <MapPinIcon className="h-5 w-5 mr-2" />
                                                {chunk.maps.title}
                                            </a>
                                        </li>
                                    )
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Discover;
