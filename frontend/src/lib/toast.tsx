import { toast as sonnerToast } from 'sonner'
import { CheckCircle, AlertCircle, Info, Loader2 } from 'lucide-react'

/**
 * Custom toast utility with app theme styling
 * Uses Sonner under the hood with consistent branding
 */

interface ToastOptions {
  description?: string
  duration?: number
}

export const toast = {
  success: (message: string, options?: ToastOptions) => {
    return sonnerToast.success(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      className: 'border-l-4 border-green-500',
    })
  },

  error: (message: string, options?: ToastOptions) => {
    return sonnerToast.error(message, {
      description: options?.description,
      duration: options?.duration || 5000, // Errors stay longer
      icon: <AlertCircle className="h-5 w-5 text-red-600" />,
      className: 'border-l-4 border-red-500',
    })
  },

  info: (message: string, options?: ToastOptions) => {
    return sonnerToast.info(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      icon: <Info className="h-5 w-5 text-blue-600" />,
      className: 'border-l-4 border-blue-500',
    })
  },

  loading: (message: string, options?: ToastOptions) => {
    return sonnerToast.loading(message, {
      description: options?.description,
      icon: <Loader2 className="h-5 w-5 animate-spin text-purple-600" />,
      className: 'border-l-4 border-purple-500',
    })
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: Error) => string)
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
      classNames: {
        success: 'border-l-4 border-green-500',
        error: 'border-l-4 border-red-500',
        loading: 'border-l-4 border-purple-500',
      },
    })
  },

  dismiss: (toastId?: string | number) => {
    return sonnerToast.dismiss(toastId)
  },
}
