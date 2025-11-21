'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function EditWebsiteVisitPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [visit, setVisit] = useState({
    id: '',
    user_id: '',
    page_url: '',
    visit_date: '',
    duration_seconds: 0,
    referrer: '',
    user_agent: '',
    ip_address: '',
    created_at: '',
    updated_at: ''
  });

  useEffect(() => {
    const fetchVisit = async () => {
      try {
        const { data, error } = await supabase
          .from('website_visits')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;

        setVisit({
          ...data,
          visit_date: data.visit_date.split('T')[0] // Format date for input
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch website visit data',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchVisit();
    }
  }, [params.id, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVisit(prev => ({
      ...prev,
      [name]: name === 'duration_seconds' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('website_visits')
        .update({
          page_url: visit.page_url,
          visit_date: visit.visit_date,
          duration_seconds: visit.duration_seconds,
          referrer: visit.referrer,
          user_agent: visit.user_agent,
          ip_address: visit.ip_address,
          updated_at: new Date().toISOString()
        })
        .eq('id', visit.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Website visit updated successfully'
      });

      router.push('/website-visits');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update website visit',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Edit Website Visit</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.push('/website-visits')}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="page_url">Page URL</Label>
                <Input
                  id="page_url"
                  name="page_url"
                  value={visit.page_url}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="visit_date">Visit Date</Label>
                <Input
                  id="visit_date"
                  name="visit_date"
                  type="date"
                  value={visit.visit_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration_seconds">Duration (seconds)</Label>
                <Input
                  id="duration_seconds"
                  name="duration_seconds"
                  type="number"
                  min="0"
                  value={visit.duration_seconds}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ip_address">IP Address</Label>
                <Input
                  id="ip_address"
                  name="ip_address"
                  value={visit.ip_address}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="referrer">Referrer</Label>
              <Input
                id="referrer"
                name="referrer"
                value={visit.referrer}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user_agent">User Agent</Label>
              <Textarea
                id="user_agent"
                name="user_agent"
                value={visit.user_agent}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/website-visits')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
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