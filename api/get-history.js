import { verifyToken } from './_auth';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SERVICE_ROLE_KEY);

export default async function handler(req, res) {

  const device_id = verifyToken(req);

  if (!device_id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { data } = await supabase
    .from("device_data")
    .select("*")
    .eq("device_id", device_id)
    .order("created_at", { ascending: true });

  res.json(data || []);
}
