'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Globe, Store, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalWebsiteVisits: 0,
    totalStoreVisits: 0,
    totalProducts: 0,
    activeUsers: 0
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // In a real app, this would fetch from /api/dashboard
    // Mock data for demonstration
    setStats({
      totalWebsiteVisits: 1242,
      totalStoreVisits: 865,
      totalProducts: 128,
      activeUsers: 24
    });

    setChartData([
      { name: 'Jan', website: 400, store: 240 },
      { name: 'Feb', website: 300, store: 139 },
      { name: 'Mar', website: 200, store: 980 },
      { name: 'Apr', website: 278, store: 390 },
      { name: 'May', website: 189, store: 480 },
      { name: 'Jun', website: 239, store: 380 },
    ]);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sales Dashboard</h1>
        <Button onClick={() => router.push('/dashboard')}>View Full Dashboard</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Website Visits</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWebsiteVisits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Store Visits</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStoreVisits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">+3 new this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Visits Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="website" fill="#3b82f6" name="Website Visits" />
                <Bar dataKey="store" fill="#10b981" name="Store Visits" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" variant="outline" onClick={() => router.push('/website-visits')}>
              Manage Website Visits
            </Button>
            <Button className="w-full" variant="outline" onClick={() => router.push('/store-visits')}>
              Manage Store Visits
            </Button>
            <Button className="w-full" variant="outline" onClick={() => router.push('/products')}>
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
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Globe className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">New website visit recorded</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <Store className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Store visit added</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <Package className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">New product added</p>
                  <p className="text-xs text-muted-foreground">3 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}