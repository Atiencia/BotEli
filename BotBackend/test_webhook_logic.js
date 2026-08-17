require('dotenv').config({ path: 'C:/Users/User/Documents/Proyectos WEB/BotRedesSociales/backend/.env' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function test() {
  const { data: botConfig } = await supabase
    .from('bot_configs')
    .select('*')
    .limit(1)
    .single();
    
  let knowledgeText = '';
  
  try {
    const queryEmbedding = []; // Simulating Hugging Face API failure
    
    console.log("Calling RPC...");
    const { data: matches, error: matchError } = await supabase.rpc('match_knowledge', {
      query_embedding: queryEmbedding,
      match_threshold: 0.1,
      match_count: 4,
      p_user_id: botConfig.user_id
    });

    if (matchError) throw matchError;

    if (matches && matches.length > 0) {
      knowledgeText = matches.map((m) => m.content).join('\n\n');
      console.log(`Found ${matches.length} semantic matches for context.`);
    } else {
      console.log('No semantic matches found or embeddings are null, using full knowledge base as fallback.');
      const { data: fallbackData } = await supabase
        .from('knowledge')
        .select('content')
        .eq('user_id', botConfig.user_id)
        .limit(50);
      knowledgeText = fallbackData?.map(k => k.content).join('\n\n') || '';
    }
  } catch (embErr) {
    console.log('Error in semantic search, falling back to full knowledge:', embErr.message || embErr);
    const { data: fallbackData } = await supabase
      .from('knowledge')
      .select('content')
      .eq('user_id', botConfig.user_id)
      .limit(50);
    knowledgeText = fallbackData?.map(k => k.content).join('\n\n') || '';
  }
  
  console.log("FETCHED KNOWLEDGE SIZE:", knowledgeText.length);
  console.log("KNOWLEDGE TEXT PREVIEW:", knowledgeText.substring(0, 100));
}

test();
