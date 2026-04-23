import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import { getSession } from '../utils/auth';
import { getPosts, savePosts, getUsers } from '../utils/storage';
import { getAvatar } from '../components/Avatar';

function formatDate(isoDate) {
  try {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

function getExcerpt(content) {
  if (!content) return '';
  if (content.length <= 80) return content;
  return content.slice(0, 80) + '…';
}

export default function AdminDashboard() {
  const session = getSession();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const allPosts = getPosts();
    const sorted = [...allPosts].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setPosts(sorted);
    setUsers(getUsers());
  }, []);

  const totalPosts = posts.length;
  const totalUsers = users.length + 1; // +1 for hard-coded admin
  const adminCount = users.filter((u) => u.role === 'admin').length + 1;
  const userCount = users.filter((u) => u.role === 'user').length;
  const recentPosts = posts.slice(0, 5);

  const handleDelete = (postId) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this post? This action cannot be undone.'
      )
    ) {
      return;
    }

    const allPosts = getPosts();
    const updated = allPosts.filter((p) => p.id !== postId);
    savePosts(updated);

    const sorted = [...updated].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setPosts(sorted);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Gradient Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-4">
            {getAvatar('admin')}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Welcome back, {session?.displayName || session?.username || 'Admin'}!
              </h1>
              <p className="mt-1 text-indigo-200 text-sm sm:text-base">
                Here's an overview of your WriteSpace platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            value={totalPosts}
            label="Total Posts"
            icon="📝"
            color="indigo"
          />
          <StatCard
            value={totalUsers}
            label="Total Users"
            icon="👥"
            color="violet"
          />
          <StatCard
            value={adminCount}
            label="Admins"
            icon="👑"
            color="amber"
          />
          <StatCard
            value={userCount}
            label="Users"
            icon="📖"
            color="emerald"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/blogs/new"
              className="inline-flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-150"
            >
              ✍️ Write Post
            </Link>
            <Link
              to="/users"
              className="inline-flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 transition-colors duration-150"
            >
              👥 Manage Users
            </Link>
            <Link
              to="/blogs"
              className="inline-flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors duration-150"
            >
              📚 View Blogs
            </Link>
          </div>
        </div>

        {/* Recent Posts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recent Posts</h2>
            {posts.length > 5 && (
              <Link
                to="/blogs"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors duration-150"
              >
                View all →
              </Link>
            )}
          </div>

          {recentPosts.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Desktop Table */}
              <table className="hidden md:table w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentPosts.map((post) => (
                    <tr
                      key={post.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-4 py-3">
                        <Link
                          to={`/blogs/read/${post.id}`}
                          className="text-sm font-medium text-gray-800 hover:text-indigo-600 transition-colors duration-150"
                        >
                          {post.title}
                        </Link>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {getExcerpt(post.content)}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {getAvatar(post.authorId === 'admin' ? 'admin' : 'user')}
                          <span className="text-sm text-gray-600">
                            {post.authorName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {formatDate(post.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/blogs/edit/${post.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors duration-150"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors duration-150"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-100">
                {recentPosts.map((post) => (
                  <div key={post.id} className="p-4 flex flex-col gap-3">
                    <div>
                      <Link
                        to={`/blogs/read/${post.id}`}
                        className="text-sm font-medium text-gray-800 hover:text-indigo-600 transition-colors duration-150"
                      >
                        {post.title}
                      </Link>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {getExcerpt(post.content)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getAvatar(post.authorId === 'admin' ? 'admin' : 'user')}
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-gray-600">
                            {post.authorName}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatDate(post.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/blogs/edit/${post.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors duration-150"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors duration-150"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
        </div>
      </main>
    </div>
  );
}