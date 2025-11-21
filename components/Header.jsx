'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, BarChart3, MapPin, Package, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header() {
  const pathname = usePathname();

  const handleLogout = () => {
    // Logout logic will be implemented here
    console.log('Logout initiated');
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Website Visits', href: '/website-visits', icon: BarChart3 },
    { name: 'Store Visits', href: '/store-visits', icon: MapPin },
    { name: 'Products', href: '/products', icon: Package },
  ];

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4">
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center transition-colors hover:text-primary ${
                  isActive ? 'text-primary font-semibold' : 'text-muted-foreground'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href="/profile" className="w-full">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}