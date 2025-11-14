import { User, Post, Comment, Report } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'user_1',
    name: 'TPG Coder',
    email: 'admin@tpgcoder.com',
    profilePicture: 'https://picsum.photos/seed/admin/200',
    role: 'admin',
  },
  {
    id: 'user_2',
    name: 'Jane Doe',
    email: 'jane@example.com',
    profilePicture: 'https://picsum.photos/seed/jane/200',
    role: 'user',
  },
  {
    id: 'user_3',
    name: 'John Smith',
    email: 'john@example.com',
    profilePicture: 'https://picsum.photos/seed/john/200',
    role: 'user',
  },
  {
    id: 'user_4',
    name: 'Demo Admin',
    email: 'demo@admin.com',
    profilePicture: 'https://picsum.photos/seed/demo_admin/200',
    role: 'admin',
  },
];

const MOCK_COMMENTS: Comment[] = [
    {
        id: 'comment_1',
        text: 'This is an amazing post!',
        author: MOCK_USERS[2],
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'comment_2',
        text: 'Great insights, thank you for sharing.',
        author: MOCK_USERS[1],
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    }
];

export let MOCK_POSTS: Post[] = [
  {
    id: 'post_1',
    title: 'My Journey into the Alps',
    description: 'A detailed story about my recent trip to the Swiss Alps. The views were breathtaking and the experience was unforgettable. Here are some of the highlights and tips for anyone planning a similar trip. I cover everything from packing essentials to the best hiking trails we discovered. The local cuisine was also a major highlight, with fondue and raclette being my absolute favorites. I hope this inspires you to take your own adventure!',
    image: 'https://picsum.photos/seed/alps/800/600',
    author: MOCK_USERS[1],
    likes: ['user_3'],
    comments: [...MOCK_COMMENTS],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'post_2',
    title: 'The Art of Minimalist Living',
    description: 'Exploring the philosophy of minimalism and how it can declutter not just your space, but your mind. This post delves into the practical steps I took to adopt a minimalist lifestyle, from downsizing my wardrobe to curating my digital life. It has been a transformative experience that brought more clarity and purpose into my daily routine. I also share some resources that helped me along the way.',
    image: 'https://picsum.photos/seed/minimalism/800/600',
    author: MOCK_USERS[2],
    likes: ['user_1', 'user_2'],
    comments: [],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'post_3',
    title: 'A Culinary Adventure in Tokyo',
    description: 'From street food to Michelin-starred restaurants, Tokyo is a food lover\'s paradise. Join me as I recount my week-long culinary journey through this vibrant city. I tried everything from fresh sushi at the Tsukiji fish market to savory ramen in Shinjuku. This guide includes my top restaurant picks, must-try dishes, and tips for navigating the bustling food scene of Tokyo. Get ready for a delicious ride!',
    image: 'https://picsum.photos/seed/tokyo/800/600',
    author: MOCK_USERS[1],
    likes: [],
    comments: [],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export let MOCK_REPORTS: Report[] = [];