import { verifyToken } from './_auth';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SERVICE_ROLE_KEY);

export default async function handler(req, res) {

  const device_id = verifyToken(req);

  if (!device_id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { data } = await supabase
    .from("devices")
    .select("relay_state")
    .eq("device_id", device_id)
    .single();

  res.json({ state: data?.relay_state || "OFF" });
}
