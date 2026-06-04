import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_KEY
const supabase = createClient(url, key, { auth: { persistSession: false } })

const { data: existing } = await supabase.storage.getBucket('logos')
if (existing) {
  console.log('bucket "logos" already exists')
} else {
  const { error } = await supabase.storage.createBucket('logos', {
    public: true,
    fileSizeLimit: 3 * 1024 * 1024,
  })
  console.log(error ? 'error: ' + error.message : 'bucket "logos" created (public)')
}
