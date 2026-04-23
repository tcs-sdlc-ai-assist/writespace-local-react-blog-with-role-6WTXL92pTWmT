import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import UserRow from '../components/UserRow';
import { getSession } from '../utils/auth';
import { getUsers, saveUsers } from '../utils/storage';

export default function UserManagement() {
  const session = getSession();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!session || session.role !== 'admin') {
      navigate('/blogs', { replace: true });
      return;
    }
    setUsers(getUsers());
  }, []);

  const hardCodedAdmin = {
    id: 'admin',
    username: 'admin',
    displayName: 'Admin',
    role: 'admin',
    createdAt: new Date().toISOString(),
  };

  const allUsers = [hardCodedAdmin, ...users];

  const handleCreateUser = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmedDisplayName = displayName.trim();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedDisplayName || !trimmedUsername || !trimmedPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (trimmedUsername.toLowerCase() === 'admin') {
      setError('Username "admin" is reserved.');
      return;
    }

    const currentUsers = getUsers();
    const usernameExists = currentUsers.some(
      (u) => u.username.toLowerCase() === trimmedUsername.toLowerCase()
    );

    if (usernameExists) {
      setError('Username is already taken. Please choose another.');
      return;
    }

    const newUser = {
      id: crypto.randomUUID(),
      displayName: trimmedDisplayName,
      username: trimmedUsername,
      password: trimmedPassword,
      role: role,
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...currentUsers, newUser];
    saveUsers(updatedUsers);
    setUsers(updatedUsers);

    setDisplayName('');
    setUsername('');
    setPassword('');
    setRole('user');
    setSuccess(`User "${trimmedUsername}" created successfully.`);
  };

  const handleDelete = (userId) => {
    if (userId === 'admin') {
      return;
    }

    if (session && session.userId === userId) {
      return;
    }

    if (
      !window.confirm(
        'Are you sure you want to delete this user? This action cannot be undone.'
      )
    ) {
      return;
    }

    const currentUsers = getUsers();
    const updated = currentUsers.filter((u) => u.id !== userId);
    saveUsers(updated);
    setUsers(updated);
    setSuccess('User deleted successfully.');
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create new users and manage existing accounts.
          </p>
        </div>

        {/* Create User Form */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Create New User
            </h2>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="displayName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Display Name
                  </label>
                  <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter display name"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-150"
                  />
                </div>

                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-150"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-150"
                  />
                </div>

                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Role
                  </label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-150"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-150"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* User List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              All Users
            </h2>
            <span className="text-sm text-gray-500">
              {allUsers.length} user{allUsers.length === 1 ? '' : 's'}
            </span>
          </div>

          {allUsers.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden hidden md:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.map((user) => (
                      <UserRow
                        key={user.id}
                        user={user}
                        session={session}
                        onDelete={handleDelete}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {allUsers.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    session={session}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No users yet
              </h3>
              <p className="text-gray-500 text-sm">
                Create your first user using the form above.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}