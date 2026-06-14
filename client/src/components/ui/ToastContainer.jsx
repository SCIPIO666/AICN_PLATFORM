import { useToastStore } from '@/stores/toastStore'

const styles = {
  success: 'bg-green-600 text-white',
  error:   'bg-red-600 text-white',
  info:    'bg-blue-600 text-white',
  warning: 'bg-yellow-500 text-black',
}

const icons = {
  success: '✓',
  error:   '✕',
  info:    'ℹ',
  warning: '⚠',
}

export default function ToastContainer() {   // ← export default HERE
  const { toasts, removeToast } = useToastStore()

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`
            flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg
            min-w-[280px] max-w-sm ${styles[t.type]}
          `}
        >
          <span className="text-lg font-bold">{icons[t.type]}</span>
          <p className="flex-1 text-sm font-medium">{t.message}</p>
          <button
            onClick={() => removeToast(t.id)}
            className="opacity-70 hover:opacity-100 text-lg leading-none"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}