import { createClient } from '@/lib/supabase';
import { validateStoreVisit } from '@/lib/validation';
import { getToken } from 'next-auth/jwt';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(request, { params }) {
  try {
    const token = await getToken({ req: request, secret: JWT_SECRET });
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const supabase = createClient();

    const { data, error } = await supabase
      .from('store_visits')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return Response.json({ error: 'Store visit not found' }, { status: 404 });
    }

    return Response.json(data, { status: 200 });
  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const token = await getToken({ req: request, secret: JWT_SECRET });
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const formData = await request.json();

    const validation = validateStoreVisit(formData);
    if (!validation.success) {
      return Response.json({ error: validation.error.flatten() }, { status: 400 });
    }

    const supabase = createClient();

    const { data, error } = await supabase
      .from('store_visits')
      .update(validation.data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return Response.json({ error: 'Store visit not found' }, { status: 404 });
    }

    return Response.json(data, { status: 200 });
  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const token = await getToken({ req: request, secret: JWT_SECRET });
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const supabase = createClient();

    const { data, error } = await supabase
      .from('store_visits')
      .delete()
      .eq('id', id);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return Response.json({ error: 'Store visit not found' }, { status: 404 });
    }

    return Response.json({ message: 'Store visit deleted successfully' }, { status: 200 });
  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}