'use client'

import { useToast } from '@/hooks/use-toast'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        const hasTitle = Boolean(title)
        const hasDescription = Boolean(description)
        const showFallbackError = props.variant === 'destructive' && !hasTitle && !hasDescription

        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {hasTitle && <ToastTitle>{title}</ToastTitle>}
              {hasDescription && (
                <ToastDescription>{description}</ToastDescription>
              )}
              {showFallbackError && (
                <>
                  <ToastTitle>Loi</ToastTitle>
                  <ToastDescription>Da xay ra loi. Vui long thu lai.</ToastDescription>
                </>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
