import React, { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import { MOCK_POSTS } from '../data/mockData';
import { Post } from '../types';
import Spinner from '../components/Spinner';
import Pagination from '../components/Pagination';

const POSTS_PER_PAGE = 6;

const Home: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        // Simulate fetching data
        const timer = setTimeout(() => {
            setPosts(MOCK_POSTS.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    // Pagination logic
    const indexOfLastPost = currentPage * POSTS_PER_PAGE;
    const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-extrabold text-center text-gray-900 dark:text-white tracking-tight">Latest Vlogs</h1>
            {posts.length > 0 ? (
                 <>
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {currentPosts.map(post => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                 </>
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400">No posts yet. Be the first to create one!</p>
            )}
        </div>
    );
};

export default Home;
