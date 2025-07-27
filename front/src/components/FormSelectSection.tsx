import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectSectionProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  helperText?: string;
  onHelperClick?: () => void;
}

export default function FormSelectSection({
  label,
  name,
  value,
  onChange,
  options,
  helperText,
  onHelperClick,
}: FormSelectSectionProps) {
  return (
    <section>
      <label className="block text-sm font-medium text-gray-900 mb-1">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm bg-white"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helperText && (
        <button
          type="button"
          onClick={onHelperClick}
          className="text-xs text-blue-500 mt-1 hover:text-blue-700 hover:underline cursor-pointer"
        >
          {helperText}
        </button>
      )}
    </section>
  );
}
