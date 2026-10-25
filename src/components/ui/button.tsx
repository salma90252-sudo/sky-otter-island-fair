import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "press inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        primary: "bg-accent text-accent-fg",
        ghost: "bg-elevated text-ink border border-line",
        quiet: "text-muted hover:bg-accent-soft hover:text-ink",
        danger: "bg-danger text-danger-fg",
      },
      size: {
        md: "h-11 rounded-sm px-4 text-base",
        sm: "h-10 rounded-sm px-3 text-sm",
        icon: "size-11 rounded-sm",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>
>(function Button({ className, variant, size, type = "button", ...props }, ref) {
  return (
    <button ref={ref} type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
});
