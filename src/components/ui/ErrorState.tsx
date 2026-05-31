import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <AlertTriangle className="w-10 h-10 text-red-400" />
      <p className="text-star-muted max-w-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-nebula-border text-nebula-light hover:bg-nebula-muted transition-colors text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Tentar novamente
        </button>
      )}
    </div>
  )
}
