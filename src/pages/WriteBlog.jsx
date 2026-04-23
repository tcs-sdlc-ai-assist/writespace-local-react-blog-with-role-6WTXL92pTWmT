import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getPosts, savePosts } from '../utils/storage';
import { getSession } from '../utils/auth';

export default function WriteBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getSession();
  const isEditMode = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);

  const TITLE_MAX = 150;
  const CONTENT_MAX = 5000;

  useEffect(() => {
    if (!isEditMode) return;

    const posts = getPosts();
    const found = posts.find((p) => p.id === id);

    if (!found) {
      setNotFound(true);
      return;
    }

    // Ownership enforcement: regular users can only edit their own posts
    if (session.role !== 'admin' && session.userId !== found.authorId) {
      setUnauthorized(true);
      return;
    }

    setTitle(found.title);
    setContent(found.content);
  }, [id, isEditMode, session.role, session.userId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      setError('Please fill in both title and content.');
      return;
    }

    if (trimmedTitle.length > TITLE_MAX) {
      setError(`Title must be ${TITLE_MAX} characters or less.`);
      return;
    }

    if (trimmedContent.length > CONTENT_MAX) {
      setError(`Content must be ${CONTENT_MAX} characters or less.`);
      return;
    }

    const posts = getPosts();

    if (isEditMode) {
      const updatedPosts = posts.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            title: trimmedTitle,
            content: trimmedContent,
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });
      savePosts(updatedPosts);
      navigate(`/blogs/read/${id}`, { replace: true });
    } else {
      const newPost = {
        id: crypto.randomUUID(),
        title: trimmedTitle,
        content: trimmedContent,
        authorId: session.userId,
        authorName: session.displayName || session.username,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      savePosts([...posts, newPost]);
      navigate('/blogs', { replace: true });
    }
  };

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Post Not Found
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              The blog post you're trying to edit doesn't exist or has been removed.
            </p>
            <Link
              to="/blogs"
              className="inline-flex items-center px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-150"
            >
              Back to All Blogs
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Unauthorized
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              You don't have permission to edit this post.
            </p>
            <Link
              to="/blogs"
              className="inline-flex items-center px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-150"
            >
              Back to All Blogs
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-6">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors duration-150"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to All Blogs
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 sm:p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              {isEditMode ? 'Edit Post' : 'Write a New Post'}
            </h1>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Title
                  </label>
                  <span
                    className={`text-xs ${
                      title.length > TITLE_MAX ? 'text-rose-500' : 'text-gray-400'
                    }`}
                  >
                    {title.length}/{TITLE_MAX}
                  </span>
                </div>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your post title"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-150"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Content
                  </label>
                  <span
                    className={`text-xs ${
                      content.length > CONTENT_MAX ? 'text-rose-500' : 'text-gray-400'
                    }`}
                  >
                    {content.length}/{CONTENT_MAX}
                  </span>
                </div>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your blog content here…"
                  rows={12}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-150 resize-y"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Link
                  to="/blogs"
                  className="inline-flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-150"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-150"
                >
                  {isEditMode ? 'Update Post' : 'Publish Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}