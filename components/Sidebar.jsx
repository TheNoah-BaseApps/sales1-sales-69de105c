'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  BarChart3, 
  Globe, 
  Store, 
  Package, 
  LogIn, 
  UserPlus,
  LayoutDashboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigationItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Website Visits', href: '/website-visits', icon: Globe },
  { name: 'Store Visits', href: '/store-visits', icon: Store },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Login', href: '/login', icon: LogIn },
  { name: 'Register', href: '/register', icon: UserPlus },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white w-64 fixed left-0 top-0 bottom-0 z-50">
      <div className="flex items-center h-16 px-4 border-b border-gray-800">
        <BarChart3 className="h-8 w-8 text-blue-500" />
        <span className="ml-2 text-xl font-bold">Sales1</span>
      </div>
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.name}>
                <Button
                  asChild
                  variant="ghost"
                  className={`w-full justify-start ${
                    isActive 
                      ? 'bg-gray-800 text-white' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Link href={item.href}>
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}