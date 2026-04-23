import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BlogCard from '../components/BlogCard';
import { getPosts } from '../utils/storage';
import { getSession } from '../utils/auth';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const session = getSession();

  useEffect(() => {
    const allPosts = getPosts();
    const sorted = [...allPosts].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setPosts(sorted);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Blogs</h1>
            <p className="mt-1 text-sm text-gray-500">
              {posts.length > 0
                ? `${posts.length} post${posts.length === 1 ? '' : 's'} published`
                : 'No posts yet'}
            </p>
          </div>
          <Link
            to="/blogs/new"
            className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-150"
          >
            ✍️ Write Post
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <BlogCard
                key={post.id}
                post={post}
                index={index}
                session={session}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No posts yet
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Be the first to share your thoughts on WriteSpace!
            </p>
            <Link
              to="/blogs/new"
              className="inline-flex items-center px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-150"
            >
              Create Your First Post
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}