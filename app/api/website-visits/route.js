import { createClient } from '@supabase/supabase-js';
import { jwtVerify } from 'lib/jwt';
import { websiteVisitSchema } from 'lib/validation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { payload } = await jwtVerify(token);

    if (!payload) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('website_visits')
      .select('*')
      .eq('user_id', payload.id)
      .order('created_at', { ascending: false });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data, { status: 200 });
  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { payload } = await jwtVerify(token);

    if (!payload) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = websiteVisitSchema.parse(body);

    const { data, error } = await supabase
      .from('website_visits')
      .insert({
        ...validatedData,
        user_id: payload.id,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data, { status: 201 });
  } catch (error) {
    if (error.name === 'ZodError') {
      return Response.json({ error: 'Invalid data', issues: error.issues }, { status: 400 });
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}