import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_POSTS, MOCK_USERS, MOCK_REPORTS } from '../data/mockData';
import { Post, User, Report } from '../types';
import { useAuth } from '../context/AuthContext';
import { TrashIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Pagination from '../components/Pagination';

const POSTS_PER_PAGE = 5;

const AdminDashboard: React.FC = () => {
    const { user: adminUser } = useAuth();
    const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
    const [postsCurrentPage, setPostsCurrentPage] = useState(1);

    const deletePost = (postId: string) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            const updatedPosts = posts.filter(p => p.id !== postId);
            setPosts(updatedPosts);
            const postIndex = MOCK_POSTS.findIndex(p => p.id === postId);
            if (postIndex > -1) MOCK_POSTS.splice(postIndex, 1);
            
            // Adjust page if the last item on it was deleted
            const totalPages = Math.ceil(updatedPosts.length / POSTS_PER_PAGE);
            if (postsCurrentPage > totalPages && totalPages > 0) {
                setPostsCurrentPage(totalPages);
            }
        }
    };
    
    const deleteUser = (userId: string) => {
        if (window.confirm('Are you sure you want to delete this user? This is irreversible.')) {
            setUsers(users.filter(u => u.id !== userId));
            const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
            if (userIndex > -1) MOCK_USERS.splice(userIndex, 1);
        }
    };

    const toggleUserRole = (userId: string) => {
        const userToToggle = users.find(u => u.id === userId);
        if (!userToToggle) return;
        
        const newRole = userToToggle.role === 'admin' ? 'user' : 'admin';
        if(window.confirm(`Are you sure you want to change ${userToToggle.name}'s role to ${newRole}?`)) {
            // Fix: Explicitly type the return value of the map callback to `User`.
            // This provides a contextual type that prevents TypeScript from widening `newRole` to `string`.
            const updatedUsers = users.map((u): User => u.id === userId ? { ...u, role: newRole } : u);
            setUsers(updatedUsers);
            
            const mockUserIndex = MOCK_USERS.findIndex(u => u.id === userId);
            if (mockUserIndex !== -1) {
                MOCK_USERS[mockUserIndex].role = newRole;
            }
        }
    };

    const handleResolveReport = (reportId: string) => {
        // Fix: Use 'as const' to prevent TypeScript from widening the type of 'status' to 'string'.
        // This ensures the object type matches the 'Report' interface.
        const updatedReports = reports.map(r => r.id === reportId ? { ...r, status: 'resolved' as const } : r);
        setReports(updatedReports);
        const reportIndex = MOCK_REPORTS.findIndex(r => r.id === reportId);
        if(reportIndex !== -1) {
            MOCK_REPORTS[reportIndex].status = 'resolved';
        }
    };

    const handleDeleteContentAndResolve = (report: Report) => {
        if (window.confirm(`Are you sure you want to DELETE this ${report.type} and resolve the report?`)) {
            if (report.type === 'post') {
                deletePost(report.contentId);
            } else if (report.type === 'comment') {
                const postIndex = MOCK_POSTS.findIndex(p => p.id === report.postId);
                if (postIndex > -1) {
                    const updatedComments = MOCK_POSTS[postIndex].comments.filter(c => c.id !== report.contentId);
                    MOCK_POSTS[postIndex].comments = updatedComments;
                    setPosts(prevPosts => prevPosts.map(p => p.id === report.postId ? { ...p, comments: updatedComments } : p));
                }
            }
            handleResolveReport(report.id);
        }
    };

    const getContentPreview = (report: Report): { text: string; link: string } => {
        if (report.type === 'post') {
            const post = MOCK_POSTS.find(p => p.id === report.contentId);
            return {
                text: post ? `Post: "${post.title}"` : 'Deleted Post',
                link: post ? `/post/${post.id}` : '#',
            };
        } else {
            let commentText = 'Deleted Comment';
            const post = MOCK_POSTS.find(p => p.id === report.postId);
            if (post) {
                const comment = post.comments.find(c => c.id === report.contentId);
                if (comment) {
                    commentText = `Comment: "${comment.text.substring(0, 30)}..."`;
                }
            }
            return {
                text: commentText,
                link: post ? `/post/${post.id}` : '#',
            };
        }
    };

    // Posts pagination logic
    const indexOfLastPost = postsCurrentPage * POSTS_PER_PAGE;
    const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPostsPages = Math.ceil(posts.length / POSTS_PER_PAGE);


    return (
        <div className="space-y-12">
            <h1 className="text-4xl font-extrabold text-center text-gray-900 dark:text-white">Admin Dashboard</h1>
            
            {/* Manage Reports */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Manage Reports ({reports.filter(r => r.status === 'pending').length} pending)</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Content</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reason</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reported By</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {reports.map(report => {
                                const content = getContentPreview(report);
                                return (
                                <tr key={report.id} className={report.status === 'resolved' ? 'bg-gray-50 dark:bg-gray-900/50 opacity-60' : ''}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Link to={content.link} className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline" target="_blank" rel="noopener noreferrer">
                                            {content.text}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 max-w-xs truncate" title={report.reason}>{report.reason}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.reporter.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(report.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                            {report.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {report.status === 'pending' && (
                                            <div className="flex items-center justify-end space-x-2">
                                                <button onClick={() => handleResolveReport(report.id)} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300" title="Mark as Resolved">
                                                    <CheckCircleIcon className="h-5 w-5"/>
                                                </button>
                                                <button onClick={() => handleDeleteContentAndResolve(report)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" title={`Delete ${report.type} & Resolve`}>
                                                    <TrashIcon className="h-5 w-5"/>
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Manage Posts */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Manage Posts ({posts.length})</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Author</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created At</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {currentPosts.map(post => (
                                <tr key={post.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{post.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{post.author.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(post.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => deletePost(post.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-600">
                                            <TrashIcon className="h-5 w-5"/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination
                    currentPage={postsCurrentPage}
                    totalPages={totalPostsPages}
                    onPageChange={setPostsCurrentPage}
                />
            </div>

             {/* Manage Users */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Manage Users ({users.length})</h2>
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-800' : 'bg-green-100 text-green-800'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-3">
                                            <button 
                                                onClick={() => toggleUserRole(user.id)}
                                                disabled={user.id === adminUser?.id}
                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                                title={user.id === adminUser?.id ? "Cannot change your own role" : `Change role to ${user.role === 'admin' ? 'user' : 'admin'}`}
                                            >
                                                <ArrowPathIcon className="h-5 w-5" />
                                            </button>
                                            <button 
                                                onClick={() => deleteUser(user.id)} 
                                                disabled={user.id === adminUser?.id}
                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                                title={user.id === adminUser?.id ? "Cannot delete yourself" : "Delete user"}
                                            >
                                                <TrashIcon className="h-5 w-5"/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;