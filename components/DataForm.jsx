'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { z } from 'zod';

const formSchemas = {
  websiteVisit: z.object({
    date: z.string().min(1, 'Date is required'),
    url: z.string().url('Invalid URL').min(1, 'URL is required'),
    duration: z.string().min(1, 'Duration is required'),
    notes: z.string().optional(),
  }),
  storeVisit: z.object({
    date: z.string().min(1, 'Date is required'),
    store_name: z.string().min(1, 'Store name is required'),
    location: z.string().min(1, 'Location is required'),
    duration: z.string().min(1, 'Duration is required'),
    notes: z.string().optional(),
  }),
  product: z.object({
    name: z.string().min(1, 'Product name is required'),
    category: z.string().min(1, 'Category is required'),
    price: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, 'Valid price is required'),
    description: z.string().optional(),
  }),
};

export default function DataForm({ type, initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(initialData || {});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    try {
      formSchemas[type].parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = {};
        error.errors.forEach(err => {
          formattedErrors[err.path[0]] = err.message;
        });
        setErrors(formattedErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderWebsiteVisitForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            name="date"
            type="date"
            value={formData.date || ''}
            onChange={handleInputChange}
            className={errors.date ? 'border-red-500' : ''}
          />
          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
        </div>

        <div>
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            name="duration"
            type="number"
            min="1"
            value={formData.duration || ''}
            onChange={handleInputChange}
            className={errors.duration ? 'border-red-500' : ''}
          />
          {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          name="url"
          type="url"
          placeholder="https://example.com"
          value={formData.url || ''}
          onChange={handleInputChange}
          className={errors.url ? 'border-red-500' : ''}
        />
        {errors.url && <p className="text-red-500 text-sm mt-1">{errors.url}</p>}
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Additional information about the visit"
          value={formData.notes || ''}
          onChange={handleInputChange}
        />
      </div>
    </form>
  );

  const renderStoreVisitForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            name="date"
            type="date"
            value={formData.date || ''}
            onChange={handleInputChange}
            className={errors.date ? 'border-red-500' : ''}
          />
          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
        </div>

        <div>
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            name="duration"
            type="number"
            min="1"
            value={formData.duration || ''}
            onChange={handleInputChange}
            className={errors.duration ? 'border-red-500' : ''}
          />
          {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="store_name">Store Name</Label>
        <Input
          id="store_name"
          name="store_name"
          placeholder="Enter store name"
          value={formData.store_name || ''}
          onChange={handleInputChange}
          className={errors.store_name ? 'border-red-500' : ''}
        />
        {errors.store_name && <p className="text-red-500 text-sm mt-1">{errors.store_name}</p>}
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          placeholder="City, State"
          value={formData.location || ''}
          onChange={handleInputChange}
          className={errors.location ? 'border-red-500' : ''}
        />
        {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Additional information about the visit"
          value={formData.notes || ''}
          onChange={handleInputChange}
        />
      </div>
    </form>
  );

  const renderProductForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter product name"
            value={formData.name || ''}
            onChange={handleInputChange}
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={formData.price || ''}
            onChange={handleInputChange}
            className={errors.price ? 'border-red-500' : ''}
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Select onValueChange={(value) => handleSelectChange('category', value)} value={formData.category || ''}>
          <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="electronics">Electronics</SelectItem>
            <SelectItem value="clothing">Clothing</SelectItem>
            <SelectItem value="home">Home & Garden</SelectItem>
            <SelectItem value="books">Books</SelectItem>
            <SelectItem value="sports">Sports & Outdoors</SelectItem>
          </SelectContent>
        </Select>
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Product description"
          value={formData.description || ''}
          onChange={handleInputChange}
        />
      </div>
    </form>
  );

  const formTitles = {
    websiteVisit: 'Website Visit',
    storeVisit: 'Store Visit',
    product: 'Product',
  };

  const formRenderers = {
    websiteVisit: renderWebsiteVisitForm,
    storeVisit: renderStoreVisitForm,
    product: renderProductForm,
  };

  const renderForm = () => {
    const renderer = formRenderers[type];
    return renderer ? renderer() : <p className="text-red-500">Invalid form type</p>;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{initialData ? 'Edit' : 'Add New'} {formTitles[type]}</CardTitle>
        <CardDescription>
          {initialData 
            ? `Update details for this ${formTitles[type].toLowerCase()}` 
            : `Enter details for a new ${formTitles[type].toLowerCase()}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderForm()}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? 'Saving...' : (initialData ? 'Update' : 'Create')}
        </Button>
      </CardFooter>
    </Card>
  );
}