"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast 
            key={id} 
            {...props} 
            className="bg-white"
            style={{
              backgroundColor: props.variant === "destructive" ? "#ef4444" : undefined,
              borderColor: props.variant === "destructive" ? "#dc2626" : undefined,
              color: props.variant === "destructive" ? "#ffffff" : undefined,
            }}
          >
            <div className="grid gap-1">
              {title && <ToastTitle style={{ color: props.variant === "destructive" ? "#ffffff" : undefined }}>{title}</ToastTitle>}
              {description && (
                <ToastDescription style={{ color: props.variant === "destructive" ? "#ffffff" : undefined }}>{description}</ToastDescription>
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
