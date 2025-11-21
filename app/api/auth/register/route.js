import { createClient } from '@/lib/supabase'
import { validateRegistration } from '@/lib/validation'
import { hashPassword } from '@/lib/utils'
import { cookies } from 'next/headers'

export async function POST(request) {
  try {
    const data = await request.json()

    // Validate input
    const validatedData = validateRegistration(data)

    const supabase = createClient(cookies())

    // Check if user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('email', validatedData.email)
      .single()

    if (existingUser) {
      return Response.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw new Error(fetchError.message)
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password)

    // Create user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        name: validatedData.name,
        email: validatedData.email,
        password_hash: hashedPassword
      })
      .select('id, name, email')
      .single()

    if (insertError) {
      throw new Error(insertError.message)
    }

    return Response.json(
      {
        message: 'User registered successfully',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email
        }
      },
      { status: 201 }
    )
  } catch (error) {
    if (error.name === 'ZodError') {
      return Response.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    return Response.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}