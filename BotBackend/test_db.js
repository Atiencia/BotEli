require('dotenv').config({ path: 'C:/Users/User/Documents/Proyectos WEB/BotRedesSociales/backend/.env' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function test() {
  const { data: chats, error } = await supabase
    .from('chats')
    .select('content, role')
    .eq('platform_user_id', '1575038114151280')
    .order('timestamp', { ascending: false })
    .limit(30);
  console.log(JSON.stringify(chats, null, 2));
}
test();
