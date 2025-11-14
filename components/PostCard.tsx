import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import { timeAgo, calculateReadTime } from '../utils/helpers';
import { HeartIcon, ChatBubbleBottomCenterTextIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 group">
      <Link to={`/post/${post.id}`}>
        <img className="w-full h-56 object-cover" src={post.image} alt={post.title} />
      </Link>
      <div className="p-6">
        <div className="flex items-center mb-4">
          <img className="h-10 w-10 rounded-full object-cover mr-4" src={post.author.profilePicture} alt={post.author.name} />
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200">{post.author.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{timeAgo(post.createdAt)} · {calculateReadTime(post.description)} min read</p>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white truncate">
          <Link to={`/post/${post.id}`} className="hover:text-indigo-500 transition-colors duration-200">{post.title}</Link>
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {post.description}
        </p>
        <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <HeartIcon className="h-6 w-6 mr-1" />
              <span>{post.likes.length}</span>
            </div>
            <div className="flex items-center">
              <ChatBubbleBottomCenterTextIcon className="h-6 w-6 mr-1" />
              <span>{post.comments.length}</span>
            </div>
          </div>
          <Link to={`/post/${post.id}`} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
            Read More
            <ArrowRightIcon className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;