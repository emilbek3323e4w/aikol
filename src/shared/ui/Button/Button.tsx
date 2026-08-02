import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gold text-on-gold hover:bg-gold-hover disabled:opacity-50 disabled:hover:bg-gold",
  secondary:
    "bg-transparent border border-gold text-gold hover:bg-gold/10",
  ghost: "bg-transparent text-gold underline-offset-4 hover:underline",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-lg px-8 py-3.5 text-sm font-medium transition-colors min-h-11 ${variantClasses[variant]} ${className}`}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
