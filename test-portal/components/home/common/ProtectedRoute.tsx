'use client'

import React, { useEffect } from 'react'
import { useAppStore } from '@/store'
import { useRouter } from 'next/navigation'
import { Loading } from './LoadingSpinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'teacher' | 'student'
  redirectTo?: string
  fallback?: React.ReactNode
}

export function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = '/login',
  fallback
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAppStore()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(redirectTo)
        return
      }

      if (requiredRole && user?.role !== requiredRole) {
        router.push('/unauthorized')
        return
      }
    }
  }, [isAuthenticated, user, requiredRole, isLoading, router, redirectTo])

  if (isLoading) {
    return fallback || <Loading text="Checking authentication..." />
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null // Will redirect in useEffect
  }

  return <>{children}</>
}