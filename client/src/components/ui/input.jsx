import { useState } from 'react';

/**
 * Input — ClickHouse design language
 *
 * Focus ring: neon-volt (#faff69) border
 * Error state: red-500 border
 * Transparent bg by default (inherits surface color)
 */
export default function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  hint,
  className = '',
  inputClassName = '',
  ...props
}) {
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? 'border-red-500'
    : focused
    ? 'border-[#faff69]'
    : 'border-[var(--border-color)]';

  return (
    <div className={['w-full', className].filter(Boolean).join(' ')}>
      {label && (
        <label className="block text-[0.875rem] font-medium text-[var(--text-secondary)] mb-2">
          {label}
          {required && (
            <span className="text-[#faff69] ml-0.5" aria-hidden="true">*</span>
          )}
        </label>
      )}

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-invalid={error ? 'true' : undefined}
        className={[
          'w-full px-4 py-2.5 rounded-[4px] transition-all duration-200',
          'bg-[var(--input-bg)]',
          'border',
          borderColor,
          'text-[var(--text-primary)]',
          'placeholder:text-[var(--text-muted)]',
          'focus:outline-none',
          inputClassName,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />

      {error && (
        <p className="mt-1 text-[0.75rem] text-red-500" role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="mt-1 text-[0.75rem] text-[var(--text-muted)]">{hint}</p>
      )}
    </div>
  );
}