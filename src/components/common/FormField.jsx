

const FormField = ({ label, required, hint, children }) => (
  <div className="flex flex-col gap-1.5">

   
    <label className="flex items-center gap-1 text-sm font-medium text-gray-700 select-none">
      {label}

      
      {required && (
        <span className="text-sm leading-none text-red-500">*</span>
      )}

     
      {hint && (
        <span className="ml-0.5 text-xs font-normal text-gray-400">
          ({hint})
        </span>
      )}
    </label>

    {/* Input slot */}
    {children}
  </div>
);

export default FormField;