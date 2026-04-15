import { createClient } from '@supabase/supabase-js';
import { sessions } from './_auth';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SERVICE_ROLE_KEY
);

export default async function handler(req, res) {

  try {

    if (req.method !== "POST") {
      return res.status(405).json({ success: false, error: "Only POST allowed" });
    }

    // 🔥 FIX BODY PARSE
    let body = req.body;

    if (typeof body === "string") {
      body = JSON.parse(body);
    }

    const { device_id, password } = body || {};

    console.log("LOGIN:", device_id, password);

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

    const token = Math.random().toString(36).substring(2);

    sessions[token] = device_id;

    return res.json({ success: true, token });

  } catch (err) {
    console.log("CRASH:", err);

    // 🔥 ALWAYS RETURN JSON
    return res.status(500).json({
      success: false,
      error: "Server crash",
      details: err.message
    });
  }
}
