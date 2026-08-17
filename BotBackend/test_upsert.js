require('dotenv').config({ path: 'C:/Users/User/Documents/Proyectos WEB/BotRedesSociales/backend/.env' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function test() {
  const { data: configs } = await supabase.from('bot_configs').select('*').limit(1);
  if (!configs || configs.length === 0) return console.log("No configs found");
  
  const config = configs[0];
  const { id, created_at, updated_at, user_id, ...cleanConfigData } = config;
  
  const { data, error } = await supabase
    .from('bot_configs')
    .upsert({ 
      user_id: config.user_id, 
      ...cleanConfigData,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });
    
  if (error) {
    console.error("UPSERT ERROR:", error);
  } else {
    console.log("UPSERT SUCCESS!");
  }
}
test();
