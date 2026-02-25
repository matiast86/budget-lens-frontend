import type React from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "../../utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800",
        secondary:
          "bg-primary-100 text-primary-700 hover:bg-primary-200 active:bg-primary-200",
        outline:
          "border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 hover:text-stone-900 active:bg-stone-100",
        ghost:
          "text-stone-600 hover:bg-stone-100 hover:text-stone-900 active:bg-stone-200",
        income:
          "bg-income-500 text-white hover:bg-income-600 active:bg-income-700",
        expense:
          "bg-expense-400 text-white hover:bg-expense-500 active:bg-expense-600",
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

export const Button = ({
  children,
  variant,
  size,
  className,
  ...props
}: ButtonProps) => (
  <button
    className={cn(buttonVariants({ variant, size, className }))}
    {...props}
  >
    {children}
  </button>
);
