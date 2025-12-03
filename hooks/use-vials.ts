"use client"

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import type { Vial } from '@/types/database'

export function useVials() {
  const [vials, setVials] = useState<Vial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const supabase = createClient()

  const fetchVials = useCallback(async () => {
    console.log('[useVials] fetchVials called, user:', user?.id)
    if (!user) {
      console.log('[useVials] No user, clearing vials')
      setVials([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      console.log('[useVials] Fetching vials for user:', user.id)

      // Add timeout using AbortController
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const { data, error } = await supabase
        .from('vials')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .abortSignal(controller.signal)

      clearTimeout(timeoutId)

      console.log('[useVials] Response:', { data, error })
      if (error) {
        console.error('[useVials] Error:', error)
        setError(error.message)
      } else {
        setVials(data || [])
      }
    } catch (err) {
      console.error('[useVials] Exception:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
    setLoading(false)
  }, [user, supabase])

  useEffect(() => {
    fetchVials()

    if (!user) return

    // Real-time subscription
    const channel = supabase
      .channel('vials-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vials',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setVials(prev => [payload.new as Vial, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setVials(prev =>
              prev.map(v => v.id === (payload.new as Vial).id ? payload.new as Vial : v)
            )
          } else if (payload.eventType === 'DELETE') {
            setVials(prev => prev.filter(v => v.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, fetchVials, supabase])

  const createVial = async (vial: Omit<Vial, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('vials')
      .insert({
        ...vial,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  const updateVial = async (id: string, updates: Partial<Vial>) => {
    const { data, error } = await supabase
      .from('vials')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  const deleteVial = async (id: string) => {
    const { error } = await supabase
      .from('vials')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Deduct from vial after injection
  const deductFromVial = async (id: string, amountMg: number) => {
    const vial = vials.find(v => v.id === id)
    if (!vial) throw new Error('Vial not found')

    const newRemaining = Math.max(0, Number(vial.remaining_mg) - amountMg)
    const newStatus = newRemaining <= 0 ? 'empty' : newRemaining < Number(vial.total_mg) * 0.2 ? 'low' : 'good'

    return updateVial(id, {
      remaining_mg: newRemaining,
      status: newStatus as 'good' | 'low' | 'expired' | 'empty'
    })
  }

  return {
    vials,
    loading,
    error,
    refetch: fetchVials,
    createVial,
    updateVial,
    deleteVial,
    deductFromVial
  }
}
