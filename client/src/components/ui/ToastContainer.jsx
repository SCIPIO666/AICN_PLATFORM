import { useToastStore } from '@/stores/toastStore'
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'

const styles = {
  success: 'bg-[var(--success-bg)] text-[var(--success-text)] border border-[var(--success-border)]',
  error: 'bg-[var(--error-bg)] text-[var(--error-text)] border border-[var(--error-border)]',
  info: 'bg-[var(--info-bg)] text-[var(--info-text)] border border-[var(--info-border)]',
  warning: 'bg-[var(--warning-bg)] text-[var(--warning-text)] border border-[var(--warning-border)]',
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
}

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
      {toasts.map((toast) => {
        const IconComponent = icons[toast.type]
        
        return (
          <div
            key={toast.id}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-sharp shadow-elevated
              min-w-[280px] max-w-sm backdrop-blur-sm
              ${styles[toast.type]}
            `}
          >
            <IconComponent size={18} strokeWidth={1.75} className="flex-shrink-0" />
            <p className="flex-1 text-small font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              <X size={14} strokeWidth={1.75} />
            </button>
          </div>
        )
      })}
    </div>
  )
}