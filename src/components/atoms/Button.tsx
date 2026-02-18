import type React from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "../../utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700",
        secondary:
          "bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700",
        outline:
          "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100",
        ghost:
          "text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200",
        income:
          "bg-income-500 text-white hover:bg-income-600 active:bg-income-700",
        expense:
          "bg-expense-500 text-white hover:bg-expense-600 active:bg-expense-700",
        link: "text-primary-600 underline-offset-4 hover:underline hover:text-primary-700 p-0 h-auto",
      },
      size: {
        sm: "h-8 px-3 text-xs gap-xs",
        default: "h-10 px-4 py-2 gap-sm",
        lg: "h-12 px-6 text-base gap-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
}

export function Button({
  children,
  variant,
  size,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </button>
  );
}
