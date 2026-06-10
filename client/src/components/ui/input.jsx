import { useState } from 'react';

export default function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  className = '',
  ...props
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-caption font-medium text-text-secondary mb-2">
          {label} {required && <span className="text-neon-volt">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`
          w-full px-4 py-2.5 rounded-sharp transition-all duration-200
          bg-transparent
          border ${error ? 'border-red-500' : focused ? 'border-neon-volt' : 'border-charcoal/50'}
          text-text-primary
          placeholder:text-text-muted
          focus:outline-none
        `}
        {...props}
      />
      {error && <p className="mt-1 text-small text-red-500">{error}</p>}
    </div>
  );
}