import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import BlogCard from '../components/BlogCard';
import { getPosts } from '../utils/storage';
import { getSession } from '../utils/auth';

export default function LandingPage() {
  const [latestPosts, setLatestPosts] = useState([]);
  const session = getSession();

  useEffect(() => {
    const posts = getPosts();
    const sorted = [...posts].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setLatestPosts(sorted.slice(0, 3));
  }, []);

  const features = [
    {
      icon: '✍️',
      title: 'Write & Publish',
      description:
        'Create beautiful blog posts with a clean, distraction-free writing experience. Share your thoughts with the world.',
      color: 'bg-indigo-100 text-indigo-600',
    },
    {
      icon: '👥',
      title: 'Role-Based Access',
      description:
        'Admins manage users and all content. Writers own their posts. Everyone gets the right level of control.',
      color: 'bg-violet-100 text-violet-600',
    },
    {
      icon: '⚡',
      title: 'Instant & Local',
      description:
        'No servers, no waiting. Everything runs in your browser with instant saves and lightning-fast navigation.',
      color: 'bg-emerald-100 text-emerald-600',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
              Your Space to{' '}
              <span className="text-indigo-200">Write</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-indigo-100">
              A clean, simple blogging platform where your words take center
              stage. Write, publish, and share — all from your browser.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              {session ? (
                <Link
                  to="/blogs"
                  className="inline-flex items-center px-8 py-3 rounded-lg text-base font-semibold text-indigo-600 bg-white hover:bg-indigo-50 shadow-lg transition-colors duration-150"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-8 py-3 rounded-lg text-base font-semibold text-indigo-600 bg-white hover:bg-indigo-50 shadow-lg transition-colors duration-150"
                  >
                    Get Started — It's Free
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center px-8 py-3 rounded-lg text-base font-semibold text-white border-2 border-white/30 hover:bg-white/10 transition-colors duration-150"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900">
            Everything you need to start writing
          </h2>
          <p className="mt-3 text-gray-500 text-lg max-w-xl mx-auto">
            Simple tools, powerful features, zero setup required.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 flex flex-col items-center text-center"
            >
              <div
                className={`flex items-center justify-center w-14 h-14 rounded-full ${feature.color} text-2xl mb-5`}
              >
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900">Latest Posts</h2>
            <p className="mt-3 text-gray-500 text-lg max-w-xl mx-auto">
              See what the community has been writing about.
            </p>
          </div>

          {latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPosts.map((post, index) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  index={index}
                  session={null}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No posts yet
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Be the first to share your thoughts on WriteSpace!
              </p>
              {!session && (
                <Link
                  to="/register"
                  className="inline-flex items-center px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-150"
                >
                  Start Writing
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">✍️ WriteSpace</span>
            </div>
            <div className="flex items-center gap-6">
              <Link
                to="/"
                className="text-sm text-gray-400 hover:text-white transition-colors duration-150"
              >
                Home
              </Link>
              <Link
                to="/login"
                className="text-sm text-gray-400 hover:text-white transition-colors duration-150"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm text-gray-400 hover:text-white transition-colors duration-150"
              >
                Register
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} WriteSpace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}