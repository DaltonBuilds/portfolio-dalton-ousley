import { ProjectStatus } from '../../../types/project'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: ProjectStatus
  className?: string
}

/**
 * StatusBadge component displays a project's status with appropriate styling
 * Supports dark mode variants for all status types
 */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusStyles: Record<
    ProjectStatus,
    { bg: string; text: string; border: string }
  > = {
    Completed: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-800 dark:text-green-300',
      border: 'border-green-300 dark:border-green-700',
    },
    'In Progress': {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-800 dark:text-blue-300',
      border: 'border-blue-300 dark:border-blue-700',
    },
    'Not Started': {
      bg: 'bg-gray-100 dark:bg-gray-800',
      text: 'text-gray-800 dark:text-gray-300',
      border: 'border-gray-300 dark:border-gray-600',
    },
  }

  const styles = statusStyles[status]

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        styles.bg,
        styles.text,
        styles.border,
        className
      )}
    >
      {status}
    </span>
  )
}
