import { createClient } from '@supabase/supabase-js';
import { sessions } from './_auth';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SERVICE_ROLE_KEY
);

export default async function handler(req, res) {

  // 🔥 IMPORTANT FIX
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const { device_id, password } = req.body || {};

    console.log("LOGIN TRY:", device_id, password);

    if (!device_id || !password) {
      return res.json({ success: false, error: "Missing fields" });
    }

    const { data, error } = await supabase
      .from("devices")
      .select("*")
      .eq("device_id", device_id)
      .eq("device_password", password);

    if (error) {
      console.log("DB ERROR:", error);
      return res.json({ success: false });
    }

    if (!data || data.length === 0) {
      return res.json({ success: false });
    }

    // 🔥 generate token
    const token = Math.random().toString(36).substring(2);

    sessions[token] = device_id;

    console.log("LOGIN SUCCESS:", token);

    return res.json({ success: true, token });

  } catch (err) {
    console.log("LOGIN CRASH:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
