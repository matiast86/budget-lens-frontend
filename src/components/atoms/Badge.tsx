import type React from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "../../utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm font-semibold tabular-nums",
  {
    variants: {
      variant: {
        default:  "bg-stone-100 text-stone-600",
        primary:  "bg-primary-50 text-primary-700",
        income:   "bg-income-50 text-income-700",
        expense:  "bg-expense-50 text-expense-700",
        warning:  "bg-warning-50 text-warning-700",
        current:  "bg-primary-50 text-primary-700",
        closed:   "bg-stone-100 text-stone-500",
        future:   "bg-primary-50 text-primary-700",
      },
      size: {
        sm: "px-xs py-[2px] text-xs",
        md: "px-sm py-xs text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
}

export const Badge = ({ children, variant, size, className, ...props }: BadgeProps) => (
  <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
    {children}
  </span>
);
