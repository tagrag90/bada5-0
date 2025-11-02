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
              backgroundColor: props.variant === "destructive" 
                ? "#ef4444" 
                : "#22c55e", // default, success 모두 초록색
              borderColor: props.variant === "destructive" 
                ? "#dc2626" 
                : "#16a34a", // default, success 모두 초록색
              color: props.variant === "destructive"
                ? "#ffffff"
                : "#ffffff", // default, success 모두 흰색
            }}
          >
            <div className="grid gap-1">
              {title && (
                <ToastTitle 
                  style={{ 
                    color: "#ffffff" // 모든 토스트 흰색 텍스트 (에러 제외는 초록 배경)
                  }}
                >
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription 
                  style={{ 
                    color: "#ffffff" // 모든 토스트 흰색 텍스트
                  }}
                >
                  {description}
                </ToastDescription>
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
