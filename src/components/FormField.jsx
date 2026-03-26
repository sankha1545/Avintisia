const FormField = ({
  label,
  required = false,
  hint,
  children,
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[13px] font-medium text-text-primary">
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
          {hint && (
            <span className="text-text-muted font-normal ml-1">({hint})</span>
          )}
        </label>
      )}
      {children}
    </div>
  );
};

export default FormField;
