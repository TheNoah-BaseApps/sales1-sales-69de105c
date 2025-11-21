import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function GET(request, { params }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: 'Website visit ID is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('website_visits')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch website visit' },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Website visit not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ websiteVisit: data }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Website visit ID is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('website_visits')
      .update({
        user_id: body.user_id,
        visit_date: body.visit_date,
        page_visited: body.page_visited,
        duration_seconds: body.duration_seconds,
        ip_address: body.ip_address,
        user_agent: body.user_agent,
        referrer: body.referrer,
        device_type: body.device_type,
        browser: body.browser,
        operating_system: body.operating_system,
        country: body.country,
        city: body.city
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update website visit' },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Website visit not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ websiteVisit: data }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: 'Website visit ID is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('website_visits')
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete website visit' },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Website visit not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: 'Website visit deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}