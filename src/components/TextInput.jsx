const TextInput = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  className = '',
  ...props
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full h-10 px-3 text-sm text-text-primary placeholder-text-muted border border-border rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors ${className}`}
      {...props}
    />
  );
};

export default TextInput;
