'use server';

import { createClient } from '@/lib/supabase'
import { validateProduct } from '@/lib/validation'
import { auth } from '@/lib/jwt'

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1]
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = await auth.verifyToken(token)
    if (!userId) {
      return Response.json({ error: 'Invalid token' }, { status: 401 })
    }

    const supabase = createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json(data, { status: 200 })
  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1]
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = await auth.verifyToken(token)
    if (!userId) {
      return Response.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    const validation = validateProduct(body)

    if (!validation.success) {
      return Response.json({ error: 'Validation failed', details: validation.error }, { status: 400 })
    }

    const { name, description, price, category, stock_quantity } = validation.data

    const supabase = createClient()
    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          user_id: userId,
          name,
          description,
          price,
          category,
          stock_quantity
        }
      ])
      .select()
      .single()

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json(data, { status: 201 })
  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}