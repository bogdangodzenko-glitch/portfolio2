import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message } = await req.json()

    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid message' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const truncated = message.trim().slice(0, 500)
    const openaiKey = Deno.env.get('OPENAI_API_KEY')!
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    // 1. Embed the question
    const embeddingRes = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: truncated,
      }),
    })

    const embeddingData = await embeddingRes.json()
    const embedding = embeddingData?.data?.[0]?.embedding

    if (!embedding) {
      throw new Error('Failed to generate embedding')
    }

    // 2. Search vector database for relevant context
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { data: chunks } = await supabase.rpc('match_embeddings', {
      query_embedding: embedding,
      match_threshold: 0.4,
      match_count: 5,
    })

    const context = (chunks ?? [])
      .map((c: { content: string }) => c.content)
      .join('\n\n')

    // 3. Generate response
    const chatRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 400,
        messages: [
          {
            role: 'system',
            content: context
              ? `You are a helpful assistant for Bohdan Hodzenko's portfolio website. Answer questions about Bohdan's projects, skills, and experience using only the context below. Be concise. If the answer is not in the context, say you don't have that information.\n\nContext:\n${context}`
              : "You are a helpful assistant for Bohdan Hodzenko's portfolio website. You don't have specific information to answer this question — let the visitor know they can reach Bohdan directly via the contact links.",
          },
          { role: 'user', content: truncated },
        ],
      }),
    })

    const chatData = await chatRes.json()
    const reply = chatData?.choices?.[0]?.message?.content ?? 'Sorry, I couldn\'t generate a response.'

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Chat function error:', err)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
