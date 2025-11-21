'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Calendar, MapPin, User, Phone, Edit3, Save, X } from 'lucide-react';
import { format } from 'date-fns';

export default function EditStoreVisitPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    visit_date: '',
    location: '',
    contact_person: '',
    contact_phone: '',
    notes: '',
    follow_up_date: '',
    outcome: ''
  });

  useEffect(() => {
    fetchStoreVisit();
  }, [params.id]);

  const fetchStoreVisit = async () => {
    try {
      const response = await fetch(`/api/store-visits/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch store visit');
      const data = await response.json();

      // Format dates for the form
      const visitDate = new Date(data.visit_date);
      const followUpDate = data.follow_up_date ? new Date(data.follow_up_date) : null;

      setFormData({
        customer_name: data.customer_name || '',
        visit_date: format(visitDate, 'yyyy-MM-dd'),
        location: data.location || '',
        contact_person: data.contact_person || '',
        contact_phone: data.contact_phone || '',
        notes: data.notes || '',
        follow_up_date: followUpDate ? format(followUpDate, 'yyyy-MM-dd') : '',
        outcome: data.outcome || ''
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load store visit data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch(`/api/store-visits/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to update store visit');

      toast({
        title: 'Success',
        description: 'Store visit updated successfully'
      });

      router.push('/store-visits');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update store visit',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Store Visit</h1>
          <p className="text-gray-600 mt-2">Update details for this store visit record</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => router.push('/store-visits')}
          className="flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Cancel
        </Button>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-blue-600" />
            Visit Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="customer_name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Customer Name
                </Label>
                <Input
                  id="customer_name"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="visit_date" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Visit Date
                </Label>
                <Input
                  id="visit_date"
                  name="visit_date"
                  type="date"
                  value={formData.visit_date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_person" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Contact Person
                </Label>
                <Input
                  id="contact_person"
                  name="contact_person"
                  value={formData.contact_person}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Contact Phone
                </Label>
                <Input
                  id="contact_phone"
                  name="contact_phone"
                  type="tel"
                  value={formData.contact_phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="follow_up_date" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Follow-up Date
                </Label>
                <Input
                  id="follow_up_date"
                  name="follow_up_date"
                  type="date"
                  value={formData.follow_up_date}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="outcome">Visit Outcome</Label>
              <Textarea
                id="outcome"
                name="outcome"
                value={formData.outcome}
                onChange={handleInputChange}
                rows={3}
                placeholder="Describe the outcome of this visit..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                placeholder="Additional notes about the visit..."
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/store-visits')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving} className="flex items-center gap-2">
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}