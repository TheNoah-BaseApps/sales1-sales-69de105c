'use server';

import { createClient } from '@/lib/supabase'
import { validateLogin } from '@/lib/validation'
import { signToken } from '@/lib/jwt'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const data = await request.json()

    // Validate input
    const validation = validateLogin(data)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      )
    }

    const { email, password } = data

    // Create Supabase client
    const supabase = createClient()

    // Get user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, password_hash, first_name, last_name')
      .eq('email', email)
      .single()

    if (error || !user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const bcrypt = require('bcryptjs')
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = signToken({ 
      userId: user.id, 
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name
    })

    // Set cookie
    cookies().set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      sameSite: 'strict',
    })

    // Return success response without password hash
    const { password_hash, ...userWithoutPassword } = user
    return NextResponse.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}