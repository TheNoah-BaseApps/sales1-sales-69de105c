'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BarChart3, Store, Globe, Package } from 'lucide-react';
import Link from 'next/link';

export default function DashboardCard({ title, description, href, type }) {
  const getIcon = () => {
    switch (type) {
      case 'website':
        return <Globe className="w-8 h-8 text-blue-600" />;
      case 'store':
        return <Store className="w-8 h-8 text-green-600" />;
      case 'product':
        return <Package className="w-8 h-8 text-amber-600" />;
      default:
        return <BarChart3 className="w-8 h-8 text-blue-600" />;
    }
  };

  return (
    <Link href={href} className="block">
      <Card className="hover:shadow-md transition-shadow rounded-lg border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <CardDescription className="text-gray-600">{description}</CardDescription>
          </div>
          {getIcon()}
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-500 mt-2">View and manage records</div>
        </CardContent>
      </Card>
    </Link>
  );
}