
import { MenuIcon, BellIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header = ({ sidebarOpen, setSidebarOpen }: HeaderProps) => {
  const { user } = useAuth();

  const roleColors = {
    admin: 'bg-purple-100 text-purple-800',
    hospital: 'bg-blue-100 text-blue-800',
    donor: 'bg-green-100 text-green-800'
  };

  const roleColor = user?.role ? roleColors[user.role] : 'bg-gray-100 text-gray-800';

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:mr-2"
            aria-label="Toggle sidebar"
          >
            <MenuIcon size={20} />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900 hidden md:block">
            Blood Bank Management System
          </h1>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <BellIcon size={20} />
          </Button>
          
          <div className="flex items-center">
            <Avatar className="h-8 w-8 bg-bloodRed">
              <span className="text-white font-medium">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </Avatar>
            <div className="ml-3 hidden md:block">
              <p className="text-sm font-medium text-gray-700">{user?.name}</p>
              <div className={`text-xs px-2 py-0.5 rounded-full ${roleColor}`}>
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
