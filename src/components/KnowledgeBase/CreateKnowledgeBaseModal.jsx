import { X, ChevronDown } from 'lucide-react';
import { useState } from 'react';


const vectorStoreOptions = [
  { value: 'qdrant',   label: 'Qdrant'   },
  { value: 'pinecone', label: 'Pinecone' },
  { value: 'weaviate', label: 'Weaviate' },
  { value: 'chromadb', label: 'ChromaDB' },
];


const embeddingModelOptions = [
  { value: 'text-embedding-ada-002', label: 'text-embedding-ada-002' },
  { value: 'text-embedding-3-small', label: 'text-embedding-3-small' },
  { value: 'text-embedding-3-large', label: 'text-embedding-3-large' },
];




const FormField = ({ label, required, hint, children }) => (

  <div className="flex flex-col gap-1.5">

    {/* ── Label row ── */}
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


    {children}
  </div>
);


const TextInput = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    value={value}

    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full px-3 py-2 text-sm text-gray-800 transition-colors duration-150 bg-white border border-gray-200 rounded-md outline-none placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
  />
);


const TextArea = ({ value, onChange, placeholder, rows = 4 }) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    rows={rows}
    className="w-full px-3 py-2 text-sm text-gray-800 transition-colors duration-150 bg-white border border-gray-200 rounded-md outline-none resize-none placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
  />
);


const SelectInput = ({ value, onChange, options, placeholder }) => (

  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 text-sm text-gray-800 transition-colors duration-150 bg-white border border-gray-200 rounded-md outline-none appearance-none cursor-pointer pr-9 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
    >
     
      {placeholder && (
        <option value="" disabled hidden>
          {placeholder}
        </option>
      )}

      {/* Render each option from the supplied array */}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>

   
    <span className="absolute inset-y-0 flex items-center text-gray-400 pointer-events-none right-3">
      <ChevronDown size={16} />
    </span>
  </div>
);

/**
 * Button
 * ──────
 * Generic button supporting two visual variants and three size steps.
 *
 * Props:
 *   variant  {'primary' | 'secondary'}  – colour scheme
 *   size     {'sm' | 'md' | 'lg'}       – padding / font-size
 *   type     {'button' | 'submit'}      – HTML button type
 *   onClick  {() => void}               – optional click handler
 *   children                            – button label / content
 */
const Button = ({
  variant  = 'primary',
  size     = 'md',
  type     = 'button',
  onClick,
  children,
}) => {
  // ── Size map: padding + font-size ──
  const sizeMap = {
    sm: 'px-3   py-1.5 text-xs',
    md: 'px-5   py-2   text-sm',
    lg: 'px-6   py-2.5 text-base',
  };

  const variantMap = {
 
    primary: `
      bg-indigo-600 text-white border border-indigo-600
      hover:bg-indigo-700 hover:border-indigo-700
      active:bg-indigo-800
      focus:ring-2 focus:ring-indigo-300
    `,

    secondary: `
      bg-white text-gray-700 border border-gray-300
      hover:bg-gray-50
      active:bg-gray-100
      focus:ring-2 focus:ring-gray-200
    `,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center
        rounded-md font-medium
        outline-none
        transition-colors duration-150
        cursor-pointer
        ${sizeMap[size]}
        ${variantMap[variant]}
      `}
    >
      {children}
    </button>
  );
};

// ─────────────────────────────────────────────
// MAIN MODAL COMPONENT
// ─────────────────────────────────────────────


const CreateKnowledgeBaseModal = ({ isOpen, onClose }) => {

  
  const [formData, setFormData] = useState({
    name:           '',                       
    description:    '',                      
    vectorStore:    'qdrant',                 
    embeddingModel: 'text-embedding-ada-002', 
  });

  /**
  
   *
   * @param  {string} field  – key in formData to update
   * @returns {(value: string) => void}
   */
  const handleChange = (field) => (value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * handleSubmit
   * Called when the form is submitted (Enter or "Create" button).
   * Prevents default page refresh, logs data, closes modal.
   *
   * @param {React.FormEvent<HTMLFormElement>} e
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Creating Knowledge Base:', formData);
    onClose();
  };

  // Guard – render nothing when modal is closed
  if (!isOpen) return null;

  return (
    <>
    
      <div
        className="fixed inset-0 z-50 transition-opacity bg-black/30"
        onClick={onClose}
        aria-hidden="true"
      />

      
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="kb-modal-title"
        className="
          fixed top-0 right-0 bottom-0
          w-[420px]
          bg-white
          z-[51]
          shadow-2xl
          flex flex-col
          animate-slide-in
        "
      >

     
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-start justify-between">

            {/* Title + subtitle */}
            <div>
              <h2
                id="kb-modal-title"
                className="text-[15px] font-semibold text-gray-900 leading-snug"
              >
                Create New Knowledge Base
              </h2>
              <p className="mt-0.5 text-[12px] text-gray-400 leading-relaxed">
                Best for quick answers from documents, websites and text files.
              </p>
            </div>

           
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-1 -mt-1 -mr-1 text-gray-400 transition-colors duration-150 rounded cursor-pointer hover:text-gray-600 hover:bg-gray-100"
            >
              <X size={18} />
            </button>

          </div>
        </div>

       
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 px-6 pt-5 pb-6 overflow-y-auto"
        >
       
          <div className="flex flex-col gap-5">

        
            <FormField
              label="Name"
              required
              hint="Cannot be edited later"
            >
              <TextInput
                value={formData.name}
                onChange={handleChange('name')}
                placeholder="Name"
              />
            </FormField>

           
            <FormField label="Description">
              <TextArea
                value={formData.description}
                onChange={handleChange('description')}
                placeholder="Description"
                rows={4}
              />
            </FormField>

           
            <FormField label="Vector Store" required>
              <SelectInput
                value={formData.vectorStore}
                onChange={handleChange('vectorStore')}
                options={vectorStoreOptions}
                placeholder="Select Vector Store"
              />
            </FormField>

           
            <FormField label="LLM Embedding Model" required>
              <SelectInput
                value={formData.embeddingModel}
                onChange={handleChange('embeddingModel')}
                options={embeddingModelOptions}
                placeholder="Select Embedding Model"
              />
            </FormField>

          </div>

          
          <div className="flex justify-end pt-6 mt-auto">
            <Button type="submit" variant="primary" size="md">
              Create
            </Button>
          </div>

        </form>
      </div>

      
      <style>{`
        @keyframes slideInFromRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0);    }
        }
        .animate-slide-in {
          animation: slideInFromRight 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </>
  );
};

export default CreateKnowledgeBaseModal;