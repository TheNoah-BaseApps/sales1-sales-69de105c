'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { format } from 'date-fns';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

export default function WebsiteVisitsPage() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      const { data, error } = await supabase
        .from('website_visits')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVisits(data || []);
    } catch (error) {
      console.error('Error fetching website visits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this website visit?')) return;

    try {
      const { error } = await supabase
        .from('website_visits')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchVisits();
    } catch (error) {
      console.error('Error deleting website visit:', error);
      alert('Failed to delete website visit');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Website Visits</h1>
        <Button onClick={() => router.push('/website-visits/new')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Visit
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Visit Records</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : visits.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No website visits recorded yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Pages Viewed</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visits.map((visit) => (
                  <TableRow key={visit.id}>
                    <TableCell className="font-medium">{visit.customer_name}</TableCell>
                    <TableCell>{format(new Date(visit.visit_date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{visit.duration_minutes} min</TableCell>
                    <TableCell>{visit.pages_viewed}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{visit.traffic_source}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={visit.conversion_status === 'converted' ? 'default' : 'secondary'}
                        className={visit.conversion_status === 'converted' ? 'bg-green-600' : ''}
                      >
                        {visit.conversion_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mr-2"
                        onClick={() => router.push(`/website-visits/${visit.id}/edit`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(visit.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}