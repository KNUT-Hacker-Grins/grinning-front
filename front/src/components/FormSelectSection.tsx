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
}

export default function FormSelectSection({
  label,
  name,
  value,
  onChange,
  options,
  helperText,
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
      {helperText && <p className="text-xs text-blue-500 mt-1">{helperText}</p>}
    </section>
  );
}
