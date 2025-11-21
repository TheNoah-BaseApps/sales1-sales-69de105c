import { createClient } from '@/lib/supabase';
import { validateStoreVisit } from '@/lib/validation';
import { getTokenFromRequest } from '@/lib/jwt';

export async function GET(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient(
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('store_visits')
      .select('*')
      .eq('user_id', user.id)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({
      data,
      pagination: {
        page,
        limit,
        total: data.length
      }
    });
  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient(
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const validation = validateStoreVisit(body);

    if (!validation.success) {
      return Response.json(
        { 
          error: 'Validation failed',
          details: validation.error.flatten()
        }, 
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('store_visits')
      .insert([
        {
          ...validation.data,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}