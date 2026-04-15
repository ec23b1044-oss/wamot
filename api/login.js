import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SERVICE_ROLE_KEY);

// simple in-memory token store
let sessions = {};

export default async function handler(req, res) {

  const { device_id, password } = req.body;

  const { data } = await supabase
    .from("devices")
    .select("*")
    .eq("device_id", device_id)
    .eq("device_password", password);

  if (!data || data.length === 0) {
    return res.json({ success: false });
  }

  // 🔥 generate token
  const token = Math.random().toString(36).substring(2);

  sessions[token] = device_id;

  res.json({ success: true, token });
}
