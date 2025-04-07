import * as React from "react"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    return (
      <button
        className={cn(
          "peer h-6 w-10 rounded-full border-2 border-transparent bg-secondary shadow-sm transition-colors data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary",
          className,
        )}
        role="switch"
        aria-checked={props["aria-checked"]}
        data-state={props["aria-checked"]}
        {...props}
        ref={ref}
      />
    )
  },
)
Switch.displayName = "Switch"

export { Switch }

