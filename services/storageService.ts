import { User, Post, Report } from '../types';
import { MOCK_USERS, MOCK_POSTS, MOCK_REPORTS } from '../data/mockData';

const KEYS = {
    USERS: 'vlogify_users',
    POSTS: 'vlogify_posts',
    REPORTS: 'vlogify_reports',
};

// Generic getter with robust error handling and logging
const getFromStorage = <T>(key: string): T | null => {
    try {
        const item = localStorage.getItem(key);
        if (item) {
            // console.log(`[StorageService] Data found for key: ${key}.`);
            return JSON.parse(item);
        }
        // console.log(`[StorageService] No data for key: ${key}.`);
        return null;
    } catch (error) {
        console.error(`[StorageService] Error reading or parsing data for key "${key}".`, error);
        return null; // Return null on error to allow for re-initialization
    }
};

// Generic setter with robust error handling and logging
const saveToStorage = <T>(key: string, data: T) => {
    try {
        console.log(`[StorageService] Saving data to localStorage for key: ${key}`, data);
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`[StorageService] Failed to save to localStorage for key "${key}":`, error);
    }
};

// Initialize data if it's not already in localStorage
export const initializeData = () => {
    console.log("[StorageService] Checking for existing data...");

    if (getFromStorage(KEYS.USERS) === null) {
        console.log("[StorageService] No user data found. Initializing with mock users.");
        saveToStorage<User[]>(KEYS.USERS, MOCK_USERS);
    }

    if (getFromStorage(KEYS.POSTS) === null) {
        console.log("[StorageService] No post data found. Initializing with mock posts.");
        saveToStorage<Post[]>(KEYS.POSTS, MOCK_POSTS);
    }

    if (getFromStorage(KEYS.REPORTS) === null) {
        console.log("[StorageService] No report data found. Initializing with empty reports array.");
        saveToStorage<Report[]>(KEYS.REPORTS, MOCK_REPORTS);
    }
    
    // Check if everything exists now to confirm
    if (localStorage.getItem(KEYS.USERS) && localStorage.getItem(KEYS.POSTS) && localStorage.getItem(KEYS.REPORTS)) {
         console.log("[StorageService] Data check complete. All data is present in localStorage.");
    }
};

// User Functions
export const getUsers = (): User[] => {
    return getFromStorage<User[]>(KEYS.USERS) || [];
};

export const saveUsers = (users: User[]) => {
    saveToStorage<User[]>(KEYS.USERS, users);
};

// Post Functions
export const getPosts = (): Post[] => {
    return getFromStorage<Post[]>(KEYS.POSTS) || [];
};

export const savePosts = (posts: Post[]) => {
    saveToStorage<Post[]>(KEYS.POSTS, posts);
};

// Report Functions
export const getReports = (): Report[] => {
    return getFromStorage<Report[]>(KEYS.REPORTS) || [];
};

export const saveReports = (reports: Report[]) => {
    saveToStorage<Report[]>(KEYS.REPORTS, reports);
};
