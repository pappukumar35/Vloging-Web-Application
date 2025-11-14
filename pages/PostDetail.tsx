import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_POSTS, MOCK_REPORTS } from '../data/mockData';
import { Post, Comment as CommentType, Report as ReportType } from '../types';
import { useAuth } from '../context/AuthContext';
import { timeAgo, calculateReadTime } from '../utils/helpers';
import Spinner from '../components/Spinner';
import ReportModal from '../components/ReportModal';
import ShareButtons from '../components/ShareButtons';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline, TrashIcon, PencilIcon, FlagIcon } from '@heroicons/react/24/outline';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportingContent, setReportingContent] = useState<{ type: 'post' | 'comment', id: string } | null>(null);


  useEffect(() => {
    // Simulate fetching post
    const foundPost = MOCK_POSTS.find(p => p.id === id);
    if (foundPost) {
      setPost(foundPost);
    }
    setLoading(false);
  }, [id]);

  const handleLike = () => {
    if (!user || !post) return;
    setPost(prevPost => {
        if (!prevPost) return null;
        const newLikes = prevPost.likes.includes(user.id)
            ? prevPost.likes.filter(uid => uid !== user.id)
            : [...prevPost.likes, user.id];
        return { ...prevPost, likes: newLikes };
    });
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !post || !newComment.trim()) return;

    const comment: CommentType = {
      id: `comment_${Date.now()}`,
      text: newComment,
      author: user,
      createdAt: new Date().toISOString(),
    };
    
    setPost(prevPost => {
        if (!prevPost) return null;
        return { ...prevPost, comments: [...prevPost.comments, comment] };
    });
    setNewComment('');
  };
  
  const handleDeletePost = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
        // Mock deletion
        const index = MOCK_POSTS.findIndex(p => p.id === id);
        if (index > -1) {
            MOCK_POSTS.splice(index, 1);
        }
        navigate('/');
    }
  };

  const openReportModal = (type: 'post' | 'comment', id: string) => {
    setReportingContent({ type, id });
    setIsReportModalOpen(true);
  };

  const handleReportSubmit = (reason: string) => {
    if (!user || !reportingContent || !post) return;

    const newReport: ReportType = {
        id: `report_${Date.now()}`,
        type: reportingContent.type,
        contentId: reportingContent.id,
        postId: post.id,
        reporter: user,
        reason,
        createdAt: new Date().toISOString(),
        status: 'pending',
    };

    MOCK_REPORTS.unshift(newReport);
    alert('Thank you for your report. Our administrators will review it shortly.');
    
    setIsReportModalOpen(false);
    setReportingContent(null);
  };

  if (loading) {
    return <Spinner />;
  }

  if (!post) {
    return <p className="text-center text-red-500">Post not found.</p>;
  }

  const isLiked = user && post.likes.includes(user.id);
  const isAuthor = user && post.author.id === user.id;
  const isAdmin = user && user.role === 'admin';


  return (
    <>
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <img className="w-full h-96 object-cover" src={post.image} alt={post.title} />
        <div className="p-6 md:p-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">{post.title}</h1>
          <div className="flex items-center mb-6 text-gray-500 dark:text-gray-400">
            <img className="h-12 w-12 rounded-full object-cover mr-4" src={post.author.profilePicture} alt={post.author.name} />
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">{post.author.name}</p>
              <p className="text-sm">{timeAgo(post.createdAt)} · {calculateReadTime(post.description)} min read</p>
            </div>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 mb-8">
              {post.description.split('\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-b border-gray-200 dark:border-gray-700 py-4 mb-8">
              <div className="flex items-center space-x-6">
                  <button onClick={handleLike} disabled={!user} className={`flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${isLiked ? 'text-red-500' : ''}`}>
                      {isLiked ? <HeartSolid className="h-7 w-7" /> : <HeartOutline className="h-7 w-7" />}
                      <span className="font-semibold">{post.likes.length} Likes</span>
                  </button>
                   <ShareButtons title={post.title} url={window.location.href} />
              </div>
              <div className="flex items-center space-x-4">
                  {(isAuthor || isAdmin) && (
                      <>
                          <button onClick={() => navigate(`/edit/${post.id}`)} className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-indigo-500 transition-colors">
                              <PencilIcon className="h-5 w-5" />
                              <span>Edit</span>
                          </button>
                          <button onClick={handleDeletePost} className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors">
                              <TrashIcon className="h-5 w-5" />
                              <span>Delete</span>
                          </button>
                      </>
                  )}
                  {user && !isAuthor && (
                       <button onClick={() => openReportModal('post', post.id)} className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-yellow-500 transition-colors">
                          <FlagIcon className="h-5 w-5" />
                          <span>Report Post</span>
                      </button>
                  )}
              </div>
          </div>

          {/* Comments Section */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{post.comments.length} Comments</h3>
            {user ? (
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-gray-50 dark:bg-gray-700"
                  rows={3}
                ></textarea>
                <button type="submit" className="mt-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Post Comment
                </button>
              </form>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 mb-6">You must be logged in to comment.</p>
            )}

            <div className="space-y-4">
              {post.comments.map(comment => (
                <div key={comment.id} className="flex space-x-4">
                  <img className="h-10 w-10 rounded-full" src={comment.author.profilePicture} alt={comment.author.name} />
                  <div className="flex-1">
                      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg relative group">
                          <p className="font-semibold text-gray-800 dark:text-gray-200">{comment.author.name}</p>
                          <p className="text-gray-600 dark:text-gray-300">{comment.text}</p>
                           {user && user.id !== comment.author.id && (
                              <button onClick={() => openReportModal('comment', comment.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-yellow-500 transition-opacity" title="Report this comment">
                                  <FlagIcon className="h-4 w-4" />
                              </button>
                          )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{timeAgo(comment.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          onSubmit={handleReportSubmit}
          contentType={reportingContent?.type || 'post'}
      />
    </>
  );
};

export default PostDetail;
