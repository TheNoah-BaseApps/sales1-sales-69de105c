'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Calendar, MapPin, User, Store } from 'lucide-react';
import { format } from 'date-fns';

export default function StoreVisitsPage() {
  const [storeVisits, setStoreVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVisit, setEditingVisit] = useState(null);
  const [formData, setFormData] = useState({
    store_name: '',
    visitor_name: '',
    visit_date: '',
    notes: ''
  });
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchStoreVisits();
  }, []);

  const fetchStoreVisits = async () => {
    try {
      const { data, error } = await supabase
        .from('store_visits')
        .select('*')
        .order('visit_date', { ascending: false });

      if (error) throw error;
      setStoreVisits(data || []);
    } catch (error) {
      console.error('Error fetching store visits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingVisit) {
        const { error } = await supabase
          .from('store_visits')
          .update({
            store_name: formData.store_name,
            visitor_name: formData.visitor_name,
            visit_date: formData.visit_date,
            notes: formData.notes
          })
          .eq('id', editingVisit.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('store_visits')
          .insert([{
            store_name: formData.store_name,
            visitor_name: formData.visitor_name,
            visit_date: formData.visit_date,
            notes: formData.notes
          }]);

        if (error) throw error;
      }

      resetForm();
      fetchStoreVisits();
    } catch (error) {
      console.error('Error saving store visit:', error);
    }
  };

  const handleEdit = (visit) => {
    setEditingVisit(visit);
    setFormData({
      store_name: visit.store_name,
      visitor_name: visit.visitor_name,
      visit_date: visit.visit_date,
      notes: visit.notes || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this store visit?')) return;

    try {
      const { error } = await supabase
        .from('store_visits')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchStoreVisits();
    } catch (error) {
      console.error('Error deleting store visit:', error);
    }
  };

  const resetForm = () => {
    setEditingVisit(null);
    setFormData({
      store_name: '',
      visitor_name: '',
      visit_date: '',
      notes: ''
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Store Visits</h1>
          <p className="text-gray-600">Track and manage in-person store visits</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Store Visit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingVisit ? 'Edit Store Visit' : 'Add Store Visit'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="store_name">Store Name</Label>
                <div className="relative">
                  <Store className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="store_name"
                    placeholder="Enter store name"
                    className="pl-10"
                    value={formData.store_name}
                    onChange={(e) => setFormData({...formData, store_name: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="visitor_name">Visitor Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="visitor_name"
                    placeholder="Enter visitor name"
                    className="pl-10"
                    value={formData.visitor_name}
                    onChange={(e) => setFormData({...formData, visitor_name: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="visit_date">Visit Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="visit_date"
                    type="date"
                    className="pl-10"
                    value={formData.visit_date}
                    onChange={(e) => setFormData({...formData, visit_date: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  placeholder="Add any notes about the visit"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingVisit ? 'Update Visit' : 'Add Visit'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Store Visit Records</CardTitle>
          </CardHeader>
          <CardContent>
            {storeVisits.length === 0 ? (
              <div className="text-center py-8">
                <Store className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No store visits</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding a new store visit.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Store Name</TableHead>
                    <TableHead>Visitor</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {storeVisits.map((visit) => (
                    <TableRow key={visit.id}>
                      <TableCell className="font-medium">{visit.store_name}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4 text-gray-500" />
                          {visit.visitor_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                          {format(new Date(visit.visit_date), 'MMM d, yyyy')}
                        </div>
                      </TableCell>
                      <TableCell>{visit.notes || '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEdit(visit)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDelete(visit.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}