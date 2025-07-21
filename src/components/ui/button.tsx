import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-all duration-[1.5s] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 whitespace-normal text-center leading-tight min-h-[2.5rem] px-4 py-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-primary/30 bg-transparent text-primary hover:bg-primary/10 hover:text-primary dark:border-primary-foreground/30 dark:text-primary-foreground dark:hover:bg-primary-foreground/10",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        cta: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow animate-pulse-glow font-semibold",
        orange: "bg-orange text-orange-foreground hover:bg-orange/90 shadow-elegant",
        hero: "bg-gradient-accent text-accent-foreground hover:scale-105 transform transition-all duration-[1.5s] shadow-glow font-bold",
      },
      size: {
        default: "min-h-[2.5rem] px-4 py-2 text-sm",
        sm: "min-h-[2.25rem] px-3 py-1.5 text-sm",
        lg: "min-h-[3rem] px-8 py-3 text-base",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
