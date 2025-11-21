'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Globe, Store, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    websiteVisits: 0,
    storeVisits: 0,
    products: 0,
    users: 0
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // In a real app, this would fetch from API
    // For now, we'll use mock data that matches expected structure
    setStats({
      websiteVisits: 1242,
      storeVisits: 876,
      products: 42,
      users: 12
    });

    setChartData([
      { date: 'Jan', website: 120, store: 80 },
      { date: 'Feb', website: 190, store: 110 },
      { date: 'Mar', website: 150, store: 90 },
      { date: 'Apr', website: 210, store: 130 },
      { date: 'May', website: 180, store: 100 },
      { date: 'Jun', website: 220, store: 140 }
    ]);
  }, []);

  const statCards = [
    { title: 'Website Visits', value: stats.websiteVisits, icon: Globe, color: 'text-blue-600' },
    { title: 'Store Visits', value: stats.storeVisits, icon: Store, color: 'text-green-600' },
    { title: 'Products', value: stats.products, icon: Package, color: 'text-purple-600' },
    { title: 'Users', value: stats.users, icon: Users, color: 'text-orange-600' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={() => router.push('/website-visits/new')}>
          Add New Record
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Visits Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="website" name="Website Visits" fill="#3b82f6" />
                <Bar dataKey="store" name="Store Visits" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => router.push('/website-visits')}
            >
              <Globe className="mr-2 h-4 w-4" />
              Manage Website Visits
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => router.push('/store-visits')}
            >
              <Store className="mr-2 h-4 w-4" />
              Manage Store Visits
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => router.push('/products')}
            >
              <Package className="mr-2 h-4 w-4" />
              Manage Products
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">New website visit recorded</p>
                  <p className="text-sm text-gray-500">Today, 10:30 AM</p>
                </div>
                <Globe className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">New store visit added</p>
                  <p className="text-sm text-gray-500">Yesterday, 3:45 PM</p>
                </div>
                <Store className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Product inventory updated</p>
                  <p className="text-sm text-gray-500">Yesterday, 11:20 AM</p>
                </div>
                <Package className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}