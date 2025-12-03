import { cn } from "@/lib/utils"
import { type ButtonHTMLAttributes, forwardRef } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "destructive" | "ghost" | "outline"
  size?: "xs" | "sm" | "md" | "lg"
  loading?: boolean
}

export const GlassButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 rounded font-medium transition-all",
          "focus:outline-none focus-visible:ring-1 focus-visible:ring-primary",
          "disabled:pointer-events-none disabled:opacity-50",
          // Variants
          variant === "default" && "bg-secondary text-secondary-foreground hover:bg-muted",
          variant === "primary" && "bg-primary text-primary-foreground hover:brightness-110",
          variant === "destructive" && "bg-destructive text-destructive-foreground hover:brightness-110",
          variant === "ghost" && "hover:bg-secondary text-muted-foreground hover:text-foreground",
          variant === "outline" && "border border-border bg-transparent hover:bg-secondary text-foreground",
          // Sizes
          size === "xs" && "h-6 px-2 text-[10px]",
          size === "sm" && "h-7 px-2.5 text-xs",
          size === "md" && "h-8 px-3 text-xs",
          size === "lg" && "h-9 px-4 text-sm",
          className,
        )}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    )
  },
)
GlassButton.displayName = "GlassButton"
