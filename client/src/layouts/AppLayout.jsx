import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Menu, X, LayoutDashboard, Calendar, BookOpen, Award, Users, Settings, LogOut,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';
import { Separator } from '../components/ui/separator';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
  { path: '/sessions', label: 'Sessions', icon: Calendar, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
  { path: '/my-enrolments', label: 'My Enrolments', icon: BookOpen, roles: ['LEARNER'] },
  { path: '/my-certificates', label: 'My Certificates', icon: Award, roles: ['LEARNER'] },
  { path: '/trainer-sessions', label: 'My Sessions', icon: Calendar, roles: ['TRAINER'] },
  { path: '/trainer-application', label: 'Trainer Application', icon: Users, roles: ['LEARNER'] },
  { path: '/admin/users', label: 'User Management', icon: Users, roles: ['ADMIN'] },
  { path: '/admin/announcements', label: 'Announcements', icon: Settings, roles: ['ADMIN'] },
  { path: '/profile', label: 'Profile', icon: Settings, roles: ['LEARNER', 'TRAINER', 'ADMIN'] },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const filteredNav = navItems.filter(item =>
    item.roles.includes(user?.role)
  );

  const NavLinks = () => (
    <div className="flex flex-col gap-2">
      {filteredNav.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
      <Separator className="my-2" />
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-red-600"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-card p-4">
        <div className="mb-6 flex items-center gap-2 px-3">
          <span className="text-xl font-bold">AICN Training</span>
        </div>
        <nav className="flex-1">
          <NavLinks />
        </nav>
        <div className="mt-auto pt-4 text-xs text-muted-foreground">
          Logged in as <span className="font-medium">{user?.name}</span>
          <br />
          Role: {user?.role}
        </div>
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-50">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-4">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-xl font-bold">AICN Training</span>
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <nav>
            <NavLinks />
          </nav>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}