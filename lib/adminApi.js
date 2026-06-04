/*
  Client-side admin API helper.
  The password is collected from the operator at login, kept in sessionStorage
  (cleared when the tab closes), and sent with every request as a header.
  The browser never holds the Supabase service key — all writes happen server-side.
*/
const PW_KEY = 'rise_admin_pw'

export const getPw = () => (typeof window !== 'undefined' ? sessionStorage.getItem(PW_KEY) || '' : '')
export const setPw = (v) => sessionStorage.setItem(PW_KEY, v)
export const clearPw = () => sessionStorage.removeItem(PW_KEY)

async function call(method, body) {
  const res = await fetch('/api/admin', {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-admin-password': getPw(),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (res.status === 401) {
    const err = new Error('unauthorized')
    err.code = 401
    throw err
  }

  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.error || 'הבקשה נכשלה')
  return json
}

export const adminApi = {
  list:   ()   => call('GET'),
  create: (s)  => call('POST', s),
  update: (s)  => call('PUT', s),
  remove: (id) => call('DELETE', { id }),
}

/** Upload a logo file → returns its public URL. */
export async function uploadLogo(file) {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch('/api/upload-logo', {
    method: 'POST',
    headers: { 'x-admin-password': getPw() },
    body: fd,
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.error || 'העלאה נכשלה')
  return json.url
}
