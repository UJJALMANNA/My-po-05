// ============================================================
// supabase-config.js
// Shared Supabase client — imported by every page that needs auth
// ============================================================

// Loaded from CDN in each HTML page via:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

const SUPABASE_URL = "https://wywiviqovmwdthtuxtvw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5d2l2aXFvdm13ZHRodHV4dHZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3Nzc5MTUsImV4cCI6MjA5NzM1MzkxNX0.5IgGaMKww513V4dxljTK7KFcTby0OwGbDe89e6UCs0E";

// Create a single shared client instance
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
