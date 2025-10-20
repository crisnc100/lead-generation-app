import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const textEncoder = new TextEncoder()

function base64UrlEncode(input: string | Uint8Array): string {
  const bytes = typeof input === 'string' ? textEncoder.encode(input) : input
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

// Helper function to create JWT using native crypto
async function createJWT(payload: Record<string, any>, secret: string): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' }

  const headerB64 = base64UrlEncode(JSON.stringify(header))
  const payloadB64 = base64UrlEncode(JSON.stringify(payload))

  const data = `${headerB64}.${payloadB64}`

  // Sign with HMAC-SHA256
  const key = await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign('HMAC', key, textEncoder.encode(data))
  const signatureB64 = base64UrlEncode(new Uint8Array(signature))

  return `${data}.${signatureB64}`
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🔐 [AUTH] Starting authentication check')

    // 1. Verify user is authenticated
    const authHeader = req.headers.get('Authorization')
    console.log('🔐 [AUTH] Authorization header present:', !!authHeader)

    if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
      console.error('❌ [AUTH] Missing or invalid authorization header')
      return new Response(
        JSON.stringify({ error: 'Missing or invalid authorization header' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Extract JWT token from "Bearer <token>" format
    const userToken = authHeader.replace(/bearer\s+/i, '')

    if (!userToken) {
      console.error('❌ [AUTH] Authorization header missing bearer token')
      return new Response(
        JSON.stringify({ error: 'Invalid authorization header' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }
    console.log('🔐 [AUTH] Token extracted, length:', userToken.length)

    // Create Supabase client scoped to the caller's auth context
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    )

    // Verify user by passing JWT directly
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser(userToken)

    console.log('🔐 [AUTH] User verification result:', {
      hasUser: !!user,
      userId: user?.id,
      hasError: !!userError,
      errorMessage: userError?.message
    })

    if (userError || !user) {
      console.error('❌ [AUTH] Unauthorized - invalid token:', userError?.message)
      return new Response(
        JSON.stringify({
          error: 'Unauthorized - invalid token',
          details: userError?.message
        }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    console.log('✅ [AUTH] User authenticated successfully:', user.email)

    // 2. Parse request body
    const { search_id } = await req.json()

    if (!search_id) {
      return new Response(
        JSON.stringify({ error: 'Missing search_id in request body' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // 3. Get search details from database
    const { data: search, error: searchError } = await supabaseClient
      .from('saved_searches')
      .select('*')
      .eq('id', search_id)
      .single()

    if (searchError || !search) {
      return new Response(
        JSON.stringify({ error: 'Search not found or access denied' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // 4. Sign JWT token for n8n webhook
    const webhookSecret = Deno.env.get('N8N_WEBHOOK_SECRET')
    if (!webhookSecret) {
      throw new Error('N8N_WEBHOOK_SECRET not configured')
    }

    const payload = {
      workspace_id: search.workspace_id,
      search_id: search.id,
      location: search.location,
      niche: search.niche,
      radius_miles: search.radius_miles,
      service: search.service,
      min_score: search.min_score,
      iat: Math.floor(Date.now() / 1000),
    }

    const webhookToken = await createJWT(payload, webhookSecret)

    // 5. Call n8n webhook
    const webhookUrl = Deno.env.get('N8N_WEBHOOK_URL')
    if (!webhookUrl) {
      throw new Error('N8N_WEBHOOK_URL not configured')
    }

    const n8nResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: webhookToken }),
    })

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text()
      console.error('n8n webhook failed:', errorText)
      return new Response(
        JSON.stringify({
          error: 'Failed to trigger workflow',
          details: errorText,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const contentType = n8nResponse.headers.get('content-type') ?? ''
    const rawBody = await n8nResponse.text()
    let n8nResult: Record<string, unknown> = {}

    const trimmedBody = rawBody.trim()

    if (trimmedBody.length === 0) {
      console.log('n8n webhook returned empty body; defaulting to empty result')
    } else if (contentType.includes('application/json')) {
      try {
        n8nResult = JSON.parse(trimmedBody)
      } catch (parseError) {
        console.error('Failed to parse JSON response from n8n:', parseError)
        n8nResult = { message: trimmedBody }
      }
    } else {
      try {
        n8nResult = JSON.parse(trimmedBody)
      } catch (_parseError) {
        n8nResult = { message: trimmedBody }
      }
    }

    // 6. Update last_run_at timestamp
    const { error: updateError } = await supabaseClient
      .from('saved_searches')
      .update({
        last_run_at: new Date().toISOString(),
        last_run_count: n8nResult.qualified_leads || 0,
      })
      .eq('id', search_id)

    if (updateError) {
      console.error('Failed to update search timestamp:', updateError)
      // Don't fail the whole request if timestamp update fails
    }

    // 7. Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Workflow triggered successfully',
        qualified_leads: n8nResult.qualified_leads || 0,
        leads_found: n8nResult.leads_found || 0,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in trigger-search function:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
