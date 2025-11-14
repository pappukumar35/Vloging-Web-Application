
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive ? 'bg-indigo-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;
  
  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-3 py-2 rounded-md text-base font-medium ${
      isActive ? 'bg-indigo-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;


  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="text-white font-bold text-xl">
              TPGCODER
            </NavLink>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink to="/" className={navLinkClass}>Home</NavLink>
                <NavLink to="/discover" className={navLinkClass}>Discover</NavLink>
                <NavLink to="/discover-image" className={navLinkClass}>Image Discover</NavLink>
                {user && <NavLink to="/create" className={navLinkClass}>Create</NavLink>}
                {user?.role === 'admin' && <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {user ? (
                <>
                  <NavLink to="/profile" className="flex items-center text-gray-300 hover:text-white">
                    <img className="h-8 w-8 rounded-full" src={user.profilePicture} alt={user.name} />
                    <span className="ml-2 text-sm font-medium">{user.name}</span>
                  </NavLink>
                  <button onClick={handleLogout} className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                    Logout
                  </button>
                </>
              ) : (
                <NavLink to="/login" className={navLinkClass}>Login</NavLink>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>Home</NavLink>
            <NavLink to="/discover" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>Discover</NavLink>
            <NavLink to="/discover-image" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>Image Discover</NavLink>
            {user && <NavLink to="/create" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>Create</NavLink>}
            {user?.role === 'admin' && <NavLink to="/admin" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>Admin</NavLink>}
             {user ? (
                <>
                  <NavLink to="/profile" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>Profile</NavLink>
                  <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                    Logout
                  </button>
                </>
              ) : (
                <NavLink to="/login" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>Login</NavLink>
              )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;