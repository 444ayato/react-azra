import axios from 'axios';

// URL dasar dihentikan tepat pada domain .co saja
const SUPABASE_URL = "https://jfpzpwowhuaewxkkxooj.supabase.co"; 
const SUPABASE_ANON_KEY = "sb_publishable_8UYDCCB2kUYQVGE0gMIwnA_6ngP9JmU"; 

const api = axios.create({
  // Di sini /rest/v1 dipasangkan sebagai baseURL dasar Axios
  baseURL: `${SUPABASE_URL}/rest/v1`,
  headers: {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json'
  }
});

export default api;