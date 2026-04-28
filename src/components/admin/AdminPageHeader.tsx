import { cn } from '@/lib/utils'

interface AdminPageHeaderProps {
  title: string
  description?: React.ReactNode
  leading?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export default function AdminPageHeader({
  title,
  description,
  leading,
  actions,
  className,
}: AdminPageHeaderProps) {
  return (
    <div className={cn('mb-6 border-b border-slate-200 pb-4', className)}>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          {leading ? <div className="mb-3 flex flex-wrap items-center gap-2">{leading}</div> : null}
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          {description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}
        </div>

        {actions ? (
          <div className="flex w-full shrink-0 flex-wrap items-stretch gap-2 md:w-auto md:items-center md:justify-end">
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  )
}
