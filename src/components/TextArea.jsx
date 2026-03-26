const TextArea = ({
  value,
  onChange,
  placeholder,
  rows = 3,
  className = '',
  ...props
}) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={`w-full px-3 py-2.5 text-sm text-text-primary placeholder-text-muted border border-border rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors resize-none ${className}`}
      {...props}
    />
  );
};

export default TextArea;
