require('dotenv').config({ path: 'C:/Users/User/Documents/Proyectos WEB/BotRedesSociales/backend/.env' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function clean() {
  // Delete [SYSTEM ERROR LEARNING] and [SYSTEM DEBUG] messages from chats
  const { data, error } = await supabase
    .from('chats')
    .delete()
    .like('content', '[SYSTEM%')
    .select('id, content');
  
  if (error) {
    console.error('Error:', error);
  } else {
    console.log(`Deleted ${data?.length || 0} system debug messages`);
    data?.forEach(d => console.log(`  - ${d.content.substring(0, 60)}...`));
  }
  
  // Also delete knowledge entries with "[Aprendido del Handoff]" prefix
  const { data: kData, error: kError } = await supabase
    .from('knowledge')
    .delete()
    .like('content', '%Aprendido del Handoff%')
    .select('id, category, content');
  
  if (kError) {
    console.error('Knowledge cleanup error:', kError);
  } else {
    console.log(`Deleted ${kData?.length || 0} old-format knowledge entries`);
    kData?.forEach(d => console.log(`  - [${d.category}] ${d.content.substring(0, 60)}...`));
  }
}
clean();
