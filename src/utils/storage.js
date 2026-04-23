const POSTS_KEY = 'writespace_posts';
const USERS_KEY = 'writespace_users';

export function getPosts() {
  try {
    const data = localStorage.getItem(POSTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading posts from localStorage:', error);
    return [];
  }
}

export function savePosts(posts) {
  try {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  } catch (error) {
    console.error('Error saving posts to localStorage:', error);
  }
}

export function getUsers() {
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading users from localStorage:', error);
    return [];
  }
}

export function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users to localStorage:', error);
  }
}