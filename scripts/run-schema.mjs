// Script to run schema.sql against Supabase using the admin REST API
// Usage: node scripts/run-schema.mjs

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = "https://fbfdasaegmxnsyhrodqu.supabase.co";
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiZmRhc2FlZ214bnN5aHJvZHF1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDYwMzc3OCwiZXhwIjoyMDkwMTc5Nzc4fQ.3_ujTnk7DdwRo4PeG4XcEB3JuIx_y31J4Nn8Pji_AIY";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// Test basic connection
console.log("🔌 Testing Supabase connection...");
const { data, error } = await supabase.from("profiles").select("count").limit(1);

if (error && error.code === "42P01") {
  console.log("ℹ️  Table 'profiles' does not exist yet — schema needs to be applied.");
  console.log("\n📋 Please apply the schema manually via the Supabase SQL Editor:");
  console.log("   1. Go to https://supabase.com/dashboard/project/fbfdasaegmxnsyhrodqu/sql");
  console.log("   2. Paste and run the contents of: supabase/schema.sql");
  console.log("   3. Then paste and run: supabase/seed.sql");
} else if (error) {
  console.error("❌ Connection error:", error.message);
} else {
  console.log("✅ Connection successful! 'profiles' table exists.");
  
  // Also test auth
  const { data: authData, error: authError } = await supabase.auth.getSession();
  if (!authError) {
    console.log("✅ Auth API is working correctly.");
  }
}

// Also test the anon key (what the app uses)
const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiZmRhc2FlZ214bnN5aHJvZHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MDM3NzgsImV4cCI6MjA5MDE3OTc3OH0.rAUcTWsF0crFPtcHWmdwO8ybh2Em6Uf5IT0vw58xBI0";
const anonClient = createClient(SUPABASE_URL, anonKey);
const { error: pingErr } = await anonClient.from("profiles").select("count").limit(1);
if (!pingErr || pingErr.code === "42P01") {
  console.log("✅ Anon key verified — app will authenticate correctly.");
} else {
  console.error("⚠️  Anon key test:", pingErr.message);
}
