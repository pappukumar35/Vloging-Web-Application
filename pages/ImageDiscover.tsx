
import React, { useState, useEffect } from 'react';
import { findPlacesWithImage } from '../services/geminiService';
import { fileToBase64 } from '../utils/helpers';
import { Location } from '../types';
import Spinner from '../components/Spinner';
import { MapPinIcon, PhotoIcon } from '@heroicons/react/24/solid';

const ImageDiscover: React.FC = () => {
    const [prompt, setPrompt] = useState('Where can I find this dish near me?');
    const [location, setLocation] = useState<Location | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState<{ text: string; groundingChunks: any[] } | null>(null);
    const [locationStatus, setLocationStatus] = useState('Fetching location...');
    
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageData, setImageData] = useState<{ data: string; mimeType: string; } | null>(null);

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

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setError('');
            try {
                const base64Data = await fileToBase64(file);
                setImageData({ data: base64Data, mimeType: file.type });
            } catch (err) {
                setError('Could not process the image file.');
                setImageData(null);
            }
        }
    };

    const handleSearch = async () => {
        if (!prompt.trim()) {
            setError('Please enter a prompt.');
            return;
        }
        if (!imageData) {
            setError('Please upload an image.');
            return;
        }
        setLoading(true);
        setError('');
        setResult(null);
        try {
            const response = await findPlacesWithImage(prompt, imageData, location);
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
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Discover Places with an Image</h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">Upload an image and ask our AI to find what you're looking for.</p>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic">{locationStatus}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Image Upload */}
                    <div className="space-y-2">
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Upload Image</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="mx-auto h-32 w-auto rounded-md" />
                                ) : (
                                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                                )}
                                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                        <span>{imageFile ? 'Change image' : 'Upload a file'}</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                    </div>
                    {/* Prompt and Button */}
                    <div className="space-y-2 flex flex-col">
                         <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Question</label>
                         <textarea
                            id="prompt"
                            rows={4}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., 'Best coffee shops near me'"
                            className="flex-grow w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                         <button
                            onClick={handleSearch}
                            disabled={loading || !location || !imageData}
                            className="w-full mt-auto px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {loading ? 'Searching...' : 'Search with Image'}
                        </button>
                    </div>
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

export default ImageDiscover;
