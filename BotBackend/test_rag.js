require('dotenv').config({ path: 'C:/Users/User/Documents/Proyectos WEB/BotRedesSociales/backend/.env' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function testRAG() {
  const { data: user } = await supabase.from('bot_configs').select('user_id').limit(1).single();
  
  if (!user) {
    console.log("No user found");
    return;
  }
  
  const query = '¿Tienen una sucursal en el Centro Comercial shopping?';
  
  // We need to generate the embedding first, let's just fetch all knowledge to see if embeddings exist
  const { data: knowledge } = await supabase.from('knowledge').select('id, category, content, embedding').eq('user_id', user.user_id);
  
  console.log(`Total knowledge rows: ${knowledge.length}`);
  
  for (const row of knowledge) {
    console.log(`- ${row.category}: ${row.content.substring(0, 30)}... Has embedding? ${row.embedding ? 'YES (length: ' + JSON.parse(row.embedding).length + ')' : 'NO'}`);
  }
}
testRAG();
