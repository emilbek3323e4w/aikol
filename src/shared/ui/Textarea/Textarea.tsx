import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm text-text-muted">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={`min-h-24 rounded-lg border bg-bg-secondary px-4 py-2.5 text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-gold ${
            error ? "border-danger" : "border-line"
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-danger">{error}</span>}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
