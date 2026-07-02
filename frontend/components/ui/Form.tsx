import * as React from "react";
import { Search, ChevronDown, Check, X } from "lucide-react";
import clsx from "clsx";

// 1. Text / Password Input
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error = false, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={clsx(
          "w-full px-3 py-1.5 bg-background-primary border rounded-md text-xs text-text-primary placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-accent-primary transition-all disabled:opacity-50 disabled:pointer-events-none",
          error ? "border-danger focus:ring-danger" : "border-border-default focus:ring-accent-primary",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

// 2. Search Input
export interface SearchInputProps extends Omit<InputProps, "type"> {}
export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, error = false, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-text-secondary" />
        </span>
        <input
          ref={ref}
          type="search"
          className={clsx(
            "w-full pl-9 pr-4 py-1.5 bg-background-primary border rounded-md text-xs text-text-primary placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-accent-primary transition-all disabled:opacity-50",
            error ? "border-danger focus:ring-danger" : "border-border-default focus:ring-accent-primary",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput";

// 3. Textarea
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error = false, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={clsx(
          "w-full px-3 py-1.5 bg-background-primary border rounded-md text-xs text-text-primary placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-accent-primary transition-all disabled:opacity-50 resize-y min-h-[80px]",
          error ? "border-danger focus:ring-danger" : "border-border-default focus:ring-accent-primary",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

// 4. Checkbox
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {}
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="checkbox"
        className={clsx(
          "h-4 w-4 rounded bg-background-primary border border-border-default text-accent-primary focus:ring-offset-0 focus:ring-1 focus:ring-accent-primary accent-accent-primary cursor-pointer disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);
Checkbox.displayName = "Checkbox";

// 5. Radio
export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {}
export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="radio"
        className={clsx(
          "h-4 w-4 rounded-full bg-background-primary border border-border-default text-accent-primary focus:ring-offset-0 focus:ring-1 focus:ring-accent-primary accent-accent-primary cursor-pointer disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);
Radio.displayName = "Radio";

// 6. Switch (Toggle)
export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  checked?: boolean;
}
export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, ...props }, ref) => {
    return (
      <label className="relative inline-flex items-center cursor-pointer select-none">
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          className="sr-only peer"
          {...props}
        />
        <div className="w-9 h-5 bg-background-card peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-secondary peer-checked:after:bg-text-primary after:border-border-default after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-primary border border-border-default" />
      </label>
    );
  }
);
Switch.displayName = "Switch";

// 7. Select Dropdown
export interface SelectOption {
  value: string;
  label: string;
}
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "value" | "onChange"> {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: boolean;
  placeholder?: string;
}
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, value, onChange, error = false, placeholder, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={clsx(
            "w-full px-3 py-1.5 bg-background-primary border rounded-md text-xs text-text-primary appearance-none focus:outline-none focus:ring-1 focus:ring-accent-primary transition-all disabled:opacity-50 cursor-pointer",
            error ? "border-danger focus:ring-danger" : "border-border-default focus:ring-accent-primary",
            className
          )}
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-secondary">
          <ChevronDown className="h-3.5 w-3.5" />
        </span>
      </div>
    );
  }
);
Select.displayName = "Select";

// 8. MultiSelect Dropdown
export interface MultiSelectProps {
  options: SelectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
}
export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selectedValues,
  onChange,
  placeholder = "Select options...",
  className,
  error = false,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const toggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const removeValue = (e: React.MouseEvent, value: string) => {
    e.stopPropagation();
    onChange(selectedValues.filter((v) => v !== value));
  };

  return (
    <div ref={containerRef} className={clsx("relative w-full text-xs select-none", className)}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "w-full min-h-[30px] px-3 py-1 bg-background-primary border rounded-md flex flex-wrap items-center gap-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-accent-primary pr-8",
          error ? "border-danger" : "border-border-default"
        )}
      >
        {selectedValues.length === 0 ? (
          <span className="text-text-secondary">{placeholder}</span>
        ) : (
          selectedValues.map((val) => {
            const opt = options.find((o) => o.value === val);
            return (
              <span
                key={val}
                className="inline-flex items-center px-1.5 py-0.5 rounded bg-accent-primary/10 text-accent-primary font-medium text-[10px]"
              >
                {opt?.label || val}
                <button
                  type="button"
                  onClick={(e) => removeValue(e, val)}
                  className="ml-1 hover:text-text-primary rounded-full focus:outline-none"
                  aria-label={`Remove ${opt?.label || val}`}
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            );
          })
        )}
        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-secondary">
          <ChevronDown className="h-3.5 w-3.5" />
        </span>
      </div>

      {isOpen && (
        <ul className="absolute z-50 w-full mt-1 bg-background-card border border-border-default rounded-md shadow-lg max-h-48 overflow-y-auto p-1.5 space-y-0.5">
          {options.map((opt) => {
            const isSelected = selectedValues.includes(opt.value);
            return (
              <li
                key={opt.value}
                onClick={() => toggleOption(opt.value)}
                className={clsx(
                  "flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition-colors text-text-secondary hover:text-text-primary hover:bg-background-secondary",
                  isSelected && "text-accent-primary hover:text-accent-primary"
                )}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="h-3.5 w-3.5" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
