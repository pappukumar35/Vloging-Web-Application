
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { MOCK_POSTS } from '../data/mockData';
import { Post } from '../types';
import PostCard from '../components/PostCard';
import Spinner from '../components/Spinner';
import { useNavigate } from 'react-router-dom';
import { PencilIcon } from '@heroicons/react/24/solid';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const posts = MOCK_POSTS.filter(post => post.author.id === user.id)
                             .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setUserPosts(posts);
    }
    setLoading(false);
  }, [user]);

  if (loading || !user) {
    return <Spinner />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg mb-8 flex flex-col md:flex-row items-center relative">
        <img
          className="h-32 w-32 rounded-full object-cover mb-4 md:mb-0 md:mr-8 ring-4 ring-indigo-500"
          src={user.profilePicture}
          alt={user.name}
        />
        <div className="flex-grow text-center md:text-left">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">{user.email}</p>
          <div className="mt-4 flex space-x-4 text-gray-600 dark:text-gray-300 justify-center md:justify-start">
             <div className="text-center">
                <p className="font-bold text-2xl text-indigo-600 dark:text-indigo-400">{userPosts.length}</p>
                <p>Posts</p>
             </div>
          </div>
        </div>
         <button 
            onClick={() => navigate('/profile/edit')}
            className="absolute top-4 right-4 bg-gray-200 dark:bg-gray-700 p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            title="Edit Profile"
        >
            <PencilIcon className="h-5 w-5" />
        </button>
      </div>
      
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">My Vlogs</h2>
       {userPosts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2">
                {userPosts.map(post => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">You haven't created any posts yet.</p>
        )}
    </div>
  );
};

export default Profile;
