
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  DropletIcon, 
  HomeIcon, 
  UsersIcon, 
  PackageIcon, 
  ClipboardListIcon,
  LogOutIcon
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar = ({ open, setOpen }: SidebarProps) => {
  const { user, logout } = useAuth();

  // Navigation links based on role
  const navLinks = [
    {
      name: 'Dashboard',
      path: '/',
      icon: <HomeIcon size={20} />,
      allowedRoles: ['admin', 'hospital', 'donor']
    },
    {
      name: 'Donors',
      path: '/donors',
      icon: <UsersIcon size={20} />,
      allowedRoles: ['admin', 'hospital']
    },
    {
      name: 'Blood Inventory',
      path: '/inventory',
      icon: <PackageIcon size={20} />,
      allowedRoles: ['admin', 'hospital']
    },
    {
      name: 'Hospital Requests',
      path: '/requests',
      icon: <ClipboardListIcon size={20} />,
      allowedRoles: ['admin', 'hospital']
    }
  ];

  // Filter links based on user role
  const filteredNavLinks = navLinks.filter(link => 
    user?.role && link.allowedRoles.includes(user.role)
  );

  return (
    <aside 
      className={`bg-white text-gray-800 border-r border-gray-200 transition-all duration-300 ${
        open ? 'w-64' : 'w-20'
      } fixed inset-y-0 left-0 z-30 md:relative`}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar header */}
        <div className={`flex items-center justify-center h-16 border-b border-gray-200 ${!open ? 'px-2' : 'px-4'}`}>
          <div className="flex items-center">
            <DropletIcon className="text-bloodRed" size={24} />
            {open && (
              <span className="ml-2 font-bold text-lg">BloodBank CMS</span>
            )}
          </div>
        </div>
        
        {/* Navigation links */}
        <nav className="flex-1 pt-5 pb-4 overflow-y-auto">
          <div className="px-2 space-y-1">
            {filteredNavLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-red-50 text-bloodRed'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-bloodRed'
                  } ${!open ? 'justify-center' : ''}`
                }
              >
                <span className="text-current">{link.icon}</span>
                {open && <span className="ml-3">{link.name}</span>}
              </NavLink>
            ))}
          </div>
        </nav>
        
        {/* User section */}
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={logout}
            className={`flex items-center text-sm font-medium text-gray-700 hover:text-bloodRed transition-colors ${
              !open ? 'justify-center' : ''
            } w-full`}
          >
            <LogOutIcon size={20} />
            {open && <span className="ml-3">Log out</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
