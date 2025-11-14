
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MOCK_POSTS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { generateImage } from '../services/geminiService';
import Spinner from '../components/Spinner';
import { Post } from '../types';
import PromptTooltip from '../components/PromptTooltip';

const EditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [imagePrompt, setImagePrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3' | '3:4'>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const postToEdit = MOCK_POSTS.find(p => p.id === id);
    if (postToEdit) {
      if (user && (postToEdit.author.id === user.id || user.role === 'admin')) {
        setPost(postToEdit);
        setTitle(postToEdit.title);
        setDescription(postToEdit.description);
        setImage(postToEdit.image);
      } else {
        setError("You are not authorized to edit this post.");
        navigate('/');
      }
    } else {
      setError("Post not found.");
    }
    setLoading(false);
  }, [id, user, navigate]);

  const handleImageGenerate = async () => {
    if (!imagePrompt.trim()) {
      setError('Please enter a prompt for the image.');
      return;
    }
    setIsGenerating(true);
    setError('');
    try {
      const generatedImageUrl = await generateImage(imagePrompt, aspectRatio);
      setImage(generatedImageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (event) => {
            setImage(event.target?.result as string);
        };
        reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !image) {
        setError('Please fill all fields and provide an image.');
        return;
    };

    const postIndex = MOCK_POSTS.findIndex(p => p.id === id);
    if (postIndex !== -1) {
        MOCK_POSTS[postIndex] = {
            ...MOCK_POSTS[postIndex],
            title,
            description,
            image,
        };
        navigate(`/post/${id}`);
    } else {
        setError('Failed to update the post. It might have been deleted.');
    }
  };

  if (loading) return <Spinner />;

  if (!post) {
      return (
        <div className="text-center">
            <h2 className="text-2xl font-bold text-red-500">{error || "Post not found."}</h2>
        </div>
      );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">Edit Vlog Post</h2>
      {error && <p className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded relative mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea
            id="description"
            rows={8}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          ></textarea>
        </div>
        
        <div className="p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Post Image</h3>
            <div className="space-y-4">
                {image && <img src={image} alt="Preview" className="w-full h-auto rounded-md object-cover" />}
                
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md space-y-3">
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Generate a New Image with AI</p>
                        <PromptTooltip />
                    </div>
                    <input
                        type="text"
                        placeholder="A watercolor painting of a Parisian cafe scene"
                        value={imagePrompt}
                        onChange={(e) => setImagePrompt(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md"
                    />
                    <div className="flex items-center space-x-4">
                        <select
                            value={aspectRatio}
                            onChange={(e) => setAspectRatio(e.target.value as any)}
                            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md"
                        >
                            <option value="16:9">16:9 (Landscape)</option>
                            <option value="9:16">9:16 (Portrait)</option>
                            <option value="1:1">1:1 (Square)</option>
                            <option value="4:3">4:3 (Standard)</option>
                            <option value="3:4">3:4 (Tall)</option>
                        </select>
                        <button
                            type="button"
                            onClick={handleImageGenerate}
                            disabled={isGenerating}
                            className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-green-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            {isGenerating ? 'Generating...' : 'Generate New Image'}
                        </button>
                    </div>
                     {isGenerating && <Spinner />}
                </div>

                <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">OR</span>
                    </div>
                </div>

                <div>
                     <label htmlFor="file-upload" className="cursor-pointer bg-white dark:bg-gray-700 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                        Upload a different file
                    </label>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*"/>
                </div>
            </div>
        </div>
        
        <div>
          <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
