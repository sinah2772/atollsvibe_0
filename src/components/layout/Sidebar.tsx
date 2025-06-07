import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  BarChart2, 
  MessageSquare, 
  Users, 
  Settings, 
  LogOut,
  PenSquare,
  Briefcase,
  TrendingUp,
  GitBranch,
  BarChart3
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface NavItem {
  name: string;
  icon: React.ReactNode;
  path: string;
  external?: boolean;
}

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const navItems: NavItem[] = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Articles', icon: <FileText size={20} />, path: 'articles' },
    { name: 'New Article', icon: <PenSquare size={20} />, path: 'new-article' },
    { name: 'New Article Wizard', icon: <PenSquare size={20} />, path: 'new-article-wizard' },
    { name: 'Analytics', icon: <BarChart2 size={20} />, path: 'analytics' },
    { name: 'Advanced Analytics', icon: <TrendingUp size={20} />, path: 'advanced-analytics' },
    { name: 'Workflow', icon: <GitBranch size={20} />, path: 'workflow' },
    { name: 'Data Analysis', icon: <BarChart3 size={20} />, path: 'data-analysis' },
    { name: 'Comments', icon: <MessageSquare size={20} />, path: 'comments' },
    { name: 'Audience', icon: <Users size={20} />, path: 'audience' },
    { name: 'Business', icon: <Briefcase size={20} />, path: 'business' },
    { name: 'Settings', icon: <Settings size={20} />, path: 'settings' },
  ];

  const handleLogout = async () => {
    try {
      // Clear local storage and session storage
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('supabase.auth.expires_at');
      localStorage.removeItem('supabase.auth.refresh_token');
      sessionStorage.clear();
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate('../login', { replace: true });
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-white border-r border-gray-200 py-6 px-4">
      <div className="mb-8 px-2">
        <h2 className="text-xl font-bold text-blue-800">Habaru</h2>
        <p className="text-sm text-gray-500">Author Dashboard</p>
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                target={item.external ? '_blank' : '_self'}
                rel={item.external ? 'noopener noreferrer' : undefined}
                className={({ isActive }) => 
                  `flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors duration-150 ease-in-out ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="mt-auto pt-6 border-t border-gray-200">
        <button 
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-150 ease-in-out"
        >
          <LogOut size={20} className="mr-3" />
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;