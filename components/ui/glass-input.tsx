import { cn } from "@/lib/utils"
import { type InputHTMLAttributes, forwardRef } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const GlassInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{label}</label>
        )}
        <input
          ref={ref}
          className={cn(
            "flex h-8 w-full rounded px-2.5 py-1.5 text-xs",
            "bg-input border border-border",
            "text-foreground placeholder:text-muted-foreground/50",
            "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-all font-mono",
            error && "border-destructive focus:ring-destructive/50 focus:border-destructive",
            className,
          )}
          {...props}
        />
        {hint && !error && <span className="text-[10px] text-muted-foreground">{hint}</span>}
        {error && <span className="text-[10px] text-destructive">{error}</span>}
      </div>
    )
  },
)
GlassInput.displayName = "GlassInput"
