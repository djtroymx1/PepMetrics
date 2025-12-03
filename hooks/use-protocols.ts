"use client"

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import type { Protocol } from '@/types/database'

export function useProtocols() {
  const [protocols, setProtocols] = useState<Protocol[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const supabase = createClient()

  const fetchProtocols = useCallback(async () => {
    console.log('[useProtocols] fetchProtocols called, user:', user?.id)
    if (!user) {
      console.log('[useProtocols] No user, clearing protocols')
      setProtocols([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      console.log('[useProtocols] Fetching protocols for user:', user.id)

      // Add timeout using AbortController
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const { data, error } = await supabase
        .from('protocols')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .abortSignal(controller.signal)

      clearTimeout(timeoutId)

      console.log('[useProtocols] Response:', { data, error })
      if (error) {
        console.error('[useProtocols] Error:', error)
        setError(error.message)
      } else {
        setProtocols(data || [])
      }
    } catch (err) {
      console.error('[useProtocols] Exception:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
    setLoading(false)
  }, [user, supabase])

  useEffect(() => {
    fetchProtocols()

    if (!user) return

    // Real-time subscription
    const channel = supabase
      .channel('protocols-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'protocols',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setProtocols(prev => [payload.new as Protocol, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setProtocols(prev =>
              prev.map(p => p.id === (payload.new as Protocol).id ? payload.new as Protocol : p)
            )
          } else if (payload.eventType === 'DELETE') {
            setProtocols(prev => prev.filter(p => p.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, fetchProtocols, supabase])

  const createProtocol = async (protocol: Omit<Protocol, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('protocols')
      .insert({
        ...protocol,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  const updateProtocol = async (id: string, updates: Partial<Protocol>) => {
    const { data, error } = await supabase
      .from('protocols')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  const deleteProtocol = async (id: string) => {
    const { error } = await supabase
      .from('protocols')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  return {
    protocols,
    loading,
    error,
    refetch: fetchProtocols,
    createProtocol,
    updateProtocol,
    deleteProtocol
  }
}
