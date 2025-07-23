type InputWithLabelProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
};

export default function InputWithLabel({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
}: InputWithLabelProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-base text-gray-700"
      />
    </div>
  );
}
