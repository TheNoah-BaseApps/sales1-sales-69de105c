'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save } from 'lucide-react';
import axios from 'axios';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock_quantity: ''
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/${params.id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load product data',
          variant: 'destructive'
        });
        router.push('/products');
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id, router, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axios.put(`/api/products/${params.id}`, product);
      toast({
        title: 'Success',
        description: 'Product updated successfully'
      });
      router.push('/products');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update product',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                value={product.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={product.description}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={product.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock_quantity">Stock Quantity</Label>
                <Input
                  id="stock_quantity"
                  name="stock_quantity"
                  type="number"
                  min="0"
                  value={product.stock_quantity}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={product.category}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/products')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
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