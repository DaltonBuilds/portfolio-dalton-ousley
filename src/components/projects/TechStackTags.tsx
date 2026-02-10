import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

interface TechStackTagsProps {
  technologies: string[]
  maxDisplay?: number
  className?: string
}

/**
 * TechStackTags component renders an array of technology tags
 * Supports limiting the number of visible tags with maxDisplay prop
 */
export function TechStackTags({
  technologies,
  maxDisplay,
  className,
}: TechStackTagsProps) {
  if (!technologies || technologies.length === 0) {
    return null
  }

  const displayTechs = maxDisplay
    ? technologies.slice(0, maxDisplay)
    : technologies
  const remainingCount = maxDisplay
    ? Math.max(0, technologies.length - maxDisplay)
    : 0

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {displayTechs.map((tech) => (
        <Badge key={tech} variant="secondary" className="text-xs">
          {tech}
        </Badge>
      ))}
      {remainingCount > 0 && (
        <Badge variant="outline" className="text-xs">
          +{remainingCount} more
        </Badge>
      )}
    </div>
  )
}
