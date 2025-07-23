import React from 'react';

interface FormInputSectionProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  placeholder?: string;
  type?: string;
  rows?: number;
  helperText?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  className?: string; // className prop 추가
}

export default function FormInputSection({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  rows,
  helperText,
  buttonText,
  onButtonClick,
  className, // className prop 받기
}: FormInputSectionProps) {
  const InputComponent = type === 'textarea' ? 'textarea' : 'input';

  return (
    <section>
      <label className="block text-sm font-medium text-gray-900 mb-1">{label}</label>
      <InputComponent
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type === 'textarea' ? undefined : type} // textarea는 type 속성 없음
        rows={rows}
        className={`${className || ''} w-full px-4 py-3 border border-gray-300 rounded-xl text-sm ${type === 'textarea' ? 'resize-none' : ''} bg-gray-50`}
      />
      {helperText && <p className="text-xs text-gray-400 mt-1">{helperText}</p>}
      {buttonText && (
        <button
          onClick={onButtonClick}
          className="mt-2 w-full py-2 border rounded-xl text-sm font-medium text-gray-700 border-gray-300"
        >
          {buttonText}
        </button>
      )}
    </section>
  );
}