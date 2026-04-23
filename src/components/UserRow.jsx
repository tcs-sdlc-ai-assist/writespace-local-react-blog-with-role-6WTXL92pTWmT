import { getAvatar } from './Avatar';

const roleBadge = {
  admin: 'bg-violet-100 text-violet-700',
  user: 'bg-indigo-100 text-indigo-700',
};

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

export default function UserRow({ user, session, onDelete }) {
  const isHardCodedAdmin = user.username === 'admin' && user.role === 'admin';
  const isSelf = session && session.userId === user.id;
  const deleteDisabled = isHardCodedAdmin || isSelf;

  const badgeClasses = roleBadge[user.role] || roleBadge.user;

  return (
    <>
      {/* Desktop row */}
      <tr className="hidden md:table-row border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            {getAvatar(user.role)}
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-800">
                {user.displayName || user.username}
              </span>
              <span className="text-xs text-gray-400">@{user.username}</span>
            </div>
          </div>
        </td>
        <td className="px-4 py-3">
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${badgeClasses}`}
          >
            {user.role}
          </span>
        </td>
        <td className="px-4 py-3 text-sm text-gray-500">
          {formatDate(user.createdAt)}
        </td>
        <td className="px-4 py-3 text-right">
          <button
            onClick={() => onDelete(user.id)}
            disabled={deleteDisabled}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium transition-colors duration-150 ${
              deleteDisabled
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
            }`}
            title={
              isHardCodedAdmin
                ? 'Cannot delete the default admin'
                : isSelf
                ? 'Cannot delete yourself'
                : 'Delete user'
            }
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
        </td>
      </tr>

      {/* Mobile card */}
      <div className="md:hidden bg-white rounded-lg shadow-md p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          {getAvatar(user.role)}
          <div className="flex flex-col flex-1">
            <span className="text-sm font-medium text-gray-800">
              {user.displayName || user.username}
            </span>
            <span className="text-xs text-gray-400">@{user.username}</span>
          </div>
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${badgeClasses}`}
          >
            {user.role}
          </span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            Joined {formatDate(user.createdAt)}
          </span>
          <button
            onClick={() => onDelete(user.id)}
            disabled={deleteDisabled}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium transition-colors duration-150 ${
              deleteDisabled
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
            }`}
            title={
              isHardCodedAdmin
                ? 'Cannot delete the default admin'
                : isSelf
                ? 'Cannot delete yourself'
                : 'Delete user'
            }
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
    </>
  );
}