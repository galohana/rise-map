import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useStudios() {
  const [studios, setStudios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    supabase
      .from('rise_directory')
      .select('*')
      .eq('active', true)
      .order('business_name')
      .then(({ data, error: err }) => {
        if (err) setError(err.message)
        else setStudios(data ?? [])
        setLoading(false)
      })
  }, [])

  return { studios, loading, error }
}
