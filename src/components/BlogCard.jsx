import { Link } from 'react-router-dom';
import { getAvatar } from './Avatar';

const borderColors = [
  'border-violet-500',
  'border-indigo-500',
  'border-blue-500',
  'border-emerald-500',
  'border-amber-500',
  'border-rose-500',
  'border-teal-500',
  'border-pink-500',
];

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
  if (content.length <= 120) return content;
  return content.slice(0, 120) + '…';
}

export default function BlogCard({ post, index = 0, session }) {
  const topBorder = borderColors[index % borderColors.length];
  const canEdit =
    session &&
    (session.role === 'admin' || session.userId === post.authorId);

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden border-t-4 ${topBorder} flex flex-col h-full hover:shadow-lg transition-shadow duration-200`}
    >
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 flex-1">
          {getExcerpt(post.content)}
        </p>
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {getAvatar(post.authorId === 'admin' ? 'admin' : 'user')}
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-800">
                {post.authorName}
              </span>
              <span className="text-xs text-gray-400">
                {formatDate(post.createdAt)}
              </span>
            </div>
          </div>
          {canEdit && (
            <Link
              to={`/blogs/edit/${post.id}`}
              className="text-gray-400 hover:text-indigo-600 transition-colors duration-150"
              title="Edit post"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}