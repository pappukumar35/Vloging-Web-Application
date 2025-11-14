export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  role: 'user' | 'admin';
}

export interface Comment {
  id: string;
  text: string;
  author: User;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  description: string;
  image: string;
  author: User;
  likes: string[]; // array of user IDs
  comments: Comment[];
  createdAt: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Report {
  id:string;
  type: 'post' | 'comment';
  contentId: string;
  postId: string; // To easily link back to the post, even for comment reports
  reporter: User;
  reason: string;
  createdAt: string;
  status: 'pending' | 'resolved';
}
