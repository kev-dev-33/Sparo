import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mliwoegmbhtkzgijjawt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1saXdvZWdtYmh0a3pnaWphd3QiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc1NzI0NTUyNywiZXhwIjoyMDcyODIxNTI3fQ.bd6wXHpKn6OyCcY50MNBo11SJ4Y2nrd7QIvtM0qGdRI'

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
)