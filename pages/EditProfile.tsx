
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

const EditProfile: React.FC = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [newProfilePictureFile, setNewProfilePictureFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name);
            setProfilePicture(user.profilePicture);
        } else {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewProfilePictureFile(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                setProfilePicture(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            let updatedData = { name };
            
            // In a real app, you would upload the newProfilePictureFile to a server
            // and get back a URL. For this mock app, we'll use the base64 data URL.
            if (newProfilePictureFile && profilePicture) {
                Object.assign(updatedData, { profilePicture: profilePicture });
            }

            updateUser(updatedData);
            setSuccess('Profile updated successfully!');
            setTimeout(() => {
               navigate('/profile');
            }, 1500);

        } catch (err) {
            setError('Failed to update profile. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!user) {
        return <Spinner />;
    }

    return (
        <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">Edit Profile</h2>
            {error && <p className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded relative mb-4">{error}</p>}
            {success && <p className="bg-green-100 dark:bg-green-900 border border-green-400 text-green-700 dark:text-green-200 px-4 py-3 rounded relative mb-4">{success}</p>}
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                    <img
                        className="h-32 w-32 rounded-full object-cover ring-4 ring-indigo-500"
                        src={profilePicture || user.profilePicture}
                        alt="Profile Preview"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer bg-white dark:bg-gray-700 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                        Change Photo
                    </label>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                </div>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                 <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                    <input
                        id="email"
                        type="email"
                        value={user.email}
                        disabled
                        className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none cursor-not-allowed"
                    />
                     <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Email address cannot be changed.</p>
                </div>
                <div>
                    <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400">
                        {isLoading ? <Spinner /> : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProfile;
