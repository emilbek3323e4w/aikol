import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, error, options, placeholder, id, className = "", ...props },
    ref,
  ) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm text-text-muted">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={`min-h-11 rounded-lg border bg-bg-secondary px-4 py-2.5 text-text focus:outline-none focus:ring-2 focus:ring-gold ${
            error ? "border-danger" : "border-line"
          } ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <span className="text-xs text-danger">{error}</span>}
      </div>
    );
  },
);

Select.displayName = "Select";
