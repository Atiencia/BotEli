require('dotenv').config({ path: 'C:/Users/User/Documents/Proyectos WEB/BotRedesSociales/backend/.env' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function test() {
  const { data, error } = await supabase
    .from('knowledge')
    .select('content')
    .order('created_at', { ascending: false })
    .limit(50);
  console.log(JSON.stringify(data, null, 2));
}
test();
