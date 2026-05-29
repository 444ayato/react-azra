import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  ClipboardList, 
  BarChart3, 
  Settings,
  Component // Tambahan icon untuk halaman playground komponen
} from 'lucide-react';

export default function Sidebar() {
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20}/> },
    { name: 'Calendar', path: '/calendar', icon: <Calendar size={20}/> },
    { name: 'Patients', path: '/patients', icon: <Users size={20}/> },
    { name: 'Appointment', path: '/appointments', icon: <ClipboardList size={20}/> },
    { name: 'Reports', path: '/reports', icon: <BarChart3 size={20}/> },
    { name: 'Components', path: '/components', icon: <Component size={20}/> }, // Path playground komponen baru
  ];

  return (
    <aside className="w-72 bg-white border-r border-gray-100 flex flex-col">
      <div className="p-8">
        <div className="flex items-center gap-3 text-[var(--dark-blue)]">
          <div className="w-10 h-10 bg-[var(--primary)] rounded-full flex items-center justify-center text-white font-bold text-xl">U</div>
          <span className="text-2xl font-bold tracking-tight">Azcyra</span>
        </div>
      </div>

      <nav className="flex-1 px-6 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-medium ${
                isActive ? 'nav-link-active' : 'nav-link-idle'
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-8 border-t border-gray-100">
        <button className="flex items-center gap-4 text-gray-400 hover:text-red-500 transition-colors px-4">
          <Settings size={20}/>
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
}