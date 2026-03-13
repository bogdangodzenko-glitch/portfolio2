/**
 * Seed script — reads knowledge/*.md files, chunks them, generates
 * OpenAI embeddings, and inserts into Supabase.
 *
 * Run once: npm run seed
 * Re-run any time you update the knowledge base files.
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
 * and OPENAI_API_KEY to be set in .env
 */

import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const CHUNK_SIZE = 400   // words per chunk
const CHUNK_OVERLAP = 50 // words overlap between chunks

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function chunkText(text: string): string[] {
  const words = text.split(/\s+/)
  const chunks: string[] = []
  let i = 0
  while (i < words.length) {
    chunks.push(words.slice(i, i + CHUNK_SIZE).join(' '))
    i += CHUNK_SIZE - CHUNK_OVERLAP
  }
  return chunks.filter(c => c.trim().length > 0)
}

async function embed(text: string): Promise<number[]> {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model: 'text-embedding-3-small', input: text }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`OpenAI error: ${JSON.stringify(data)}`)
  return data.data[0].embedding
}

async function main() {
  const knowledgeDir = join(process.cwd(), 'knowledge')
  const files = readdirSync(knowledgeDir).filter(f => f.endsWith('.md'))

  console.log(`Found ${files.length} knowledge files: ${files.join(', ')}`)

  // Clear existing embeddings
  const { error: deleteError } = await supabase.from('embeddings').delete().neq('id', 0)
  if (deleteError) throw deleteError
  console.log('Cleared existing embeddings.')

  let totalChunks = 0

  for (const file of files) {
    const content = readFileSync(join(knowledgeDir, file), 'utf-8')
    const chunks = chunkText(content)
    console.log(`\n${file}: ${chunks.length} chunks`)

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]
      process.stdout.write(`  Embedding chunk ${i + 1}/${chunks.length}…`)

      const embedding = await embed(chunk)
      const { error } = await supabase.from('embeddings').insert({
        content: chunk,
        embedding,
        metadata: { source: file, chunk: i },
      })

      if (error) throw error
      process.stdout.write(' ✓\n')
      totalChunks++

      // Avoid rate limits
      await new Promise(r => setTimeout(r, 200))
    }
  }

  console.log(`\nDone! Inserted ${totalChunks} embeddings.`)
}

main().catch(err => { console.error(err); process.exit(1) })
