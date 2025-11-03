'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NotFoundProps {
  title?: string
  description?: string
  showHomeButton?: boolean
  className?: string
}

export function NotFound({
  title = "Page Not Found",
  description = "The page you're looking for doesn't exist or has been moved.",
  showHomeButton = true,
  className
}: NotFoundProps) {
  return (
    <div className={cn('min-h-screen flex items-center justify-center p-4', className)}>
      <div className="text-center max-w-md">
        <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600 mb-6">{description}</p>
        
        {showHomeButton && (
          <Button onClick={() => window.location.href = '/'}>
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        )}
      </div>
    </div>
  )
}