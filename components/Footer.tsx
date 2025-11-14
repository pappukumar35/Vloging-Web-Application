import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// SVG Icons for social media
const XIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const FacebookIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
);

const LinkedInIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
);

const YouTubeIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
);

const Footer: React.FC = () => {
    const { user } = useAuth();
    
    const socialLinks = [
  { name: 'X', href: 'https://x.com/Pappukr8862', icon: <XIcon /> },
  { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=100055391937077', icon: <FacebookIcon /> },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/pappukumar35/', icon: <LinkedInIcon /> },
  { name: 'YouTube', href: 'https://www.youtube.com/@TPGCoder', icon: <YouTubeIcon /> },
];


  return (
    <footer className="bg-gray-800 text-white mt-8 border-t border-gray-700">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
             <p className="text-sm text-gray-400 order-3 sm:order-1 mt-4 sm:mt-0">
                &copy; {new Date().getFullYear()} TPGCODER. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 order-1 sm:order-2">
                {socialLinks.map(link => (
                    <a 
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors duration-300"
                        aria-label={`Visit my ${link.name} profile`}
                    >
                        {link.icon}
                    </a>
                ))}
            </div>
            <div className="text-sm text-gray-400 order-2 sm:order-3">
                {user?.role === 'admin' ? (
                    <Link to="/admin" className="font-semibold hover:text-indigo-400 transition-colors duration-300">
                        Admin Panel
                    </Link>
                ) : (
                    <p>TPGCODER-Enhanced Vlogging</p>
                )}
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;