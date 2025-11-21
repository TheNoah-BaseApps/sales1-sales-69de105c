import { z } from 'zod';

// User validation schemas
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Website visit validation schemas
export const websiteVisitSchema = z.object({
  url: z.string().url('Invalid URL format'),
  visitor_id: z.string().uuid('Invalid visitor ID'),
  duration_seconds: z.number().min(0, 'Duration must be positive'),
  page_views: z.number().min(1, 'Page views must be at least 1'),
  created_at: z.string().datetime().optional(),
});

export const websiteVisitUpdateSchema = websiteVisitSchema.partial().extend({
  id: z.string().uuid(),
});

// Store visit validation schemas
export const storeVisitSchema = z.object({
  store_id: z.string().uuid('Invalid store ID'),
  visitor_id: z.string().uuid('Invalid visitor ID'),
  products_viewed: z.array(z.string().uuid()).min(1, 'At least one product must be viewed'),
  purchase_amount: z.number().min(0, 'Purchase amount cannot be negative').optional(),
  created_at: z.string().datetime().optional(),
});

export const storeVisitUpdateSchema = storeVisitSchema.partial().extend({
  id: z.string().uuid(),
});

// Product validation schemas
export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price cannot be negative'),
  category: z.string().min(1, 'Category is required'),
  in_stock: z.boolean().default(true),
  created_at: z.string().datetime().optional(),
});

export const productUpdateSchema = productSchema.partial().extend({
  id: z.string().uuid(),
});

// Generic validation function
export const validateData = (schema, data) => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return { success: false, errors };
    }
    return { success: false, errors: [{ message: 'Validation failed' }] };
  }
};