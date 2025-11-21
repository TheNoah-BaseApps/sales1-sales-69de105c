import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

if (!supabaseServiceRoleKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
}

// Create Supabase client for client-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Create Supabase client for server-side operations
export const createServerSupabaseClient = () => 
  createClient(supabaseUrl, supabaseServiceRoleKey)

// Helper function to get current user session
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    console.error('Error getting current user:', error)
    return null
  }

  return data.session?.user || null
}

// Auth helper functions
export async function signUpWithEmail(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(error.message)
  }
}

// Database helper functions
export async function getWebsiteVisits(userId) {
  const { data, error } = await supabase
    .from('website_visits')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function getWebsiteVisitById(id) {
  const { data, error } = await supabase
    .from('website_visits')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function createWebsiteVisit(visitData) {
  const { data, error } = await supabase
    .from('website_visits')
    .insert([visitData])
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function updateWebsiteVisit(id, updates) {
  const { data, error } = await supabase
    .from('website_visits')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function deleteWebsiteVisit(id) {
  const { error } = await supabase
    .from('website_visits')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }
}

export async function getStoreVisits(userId) {
  const { data, error } = await supabase
    .from('store_visits')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function getStoreVisitById(id) {
  const { data, error } = await supabase
    .from('store_visits')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function createStoreVisit(visitData) {
  const { data, error } = await supabase
    .from('store_visits')
    .insert([visitData])
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function updateStoreVisit(id, updates) {
  const { data, error } = await supabase
    .from('store_visits')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function deleteStoreVisit(id) {
  const { error } = await supabase
    .from('store_visits')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }
}

export async function getProducts(userId) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function getProductById(id) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function createProduct(productData) {
  const { data, error } = await supabase
    .from('products')
    .insert([productData])
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function updateProduct(id, updates) {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function deleteProduct(id) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }
}