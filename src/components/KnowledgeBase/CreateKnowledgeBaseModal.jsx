import { X, ChevronDown } from 'lucide-react';
import { useState } from 'react';

// ─────────────────────────────────────────────
// OPTIONS DATA
// ─────────────────────────────────────────────

// vectorStoreOptions – dropdown choices for the Vector Store field
const vectorStoreOptions = [
  { value: 'qdrant',   label: 'Qdrant'   },
  { value: 'pinecone', label: 'Pinecone' },
  { value: 'weaviate', label: 'Weaviate' },
  { value: 'chromadb', label: 'ChromaDB' },
];

// embeddingModelOptions – dropdown choices for the LLM Embedding Model field
const embeddingModelOptions = [
  { value: 'text-embedding-ada-002', label: 'text-embedding-ada-002' },
  { value: 'text-embedding-3-small', label: 'text-embedding-3-small' },
  { value: 'text-embedding-3-large', label: 'text-embedding-3-large' },
];

// ─────────────────────────────────────────────
// ATOMIC SUB-COMPONENTS
// ─────────────────────────────────────────────

/**
 * FormField
 * ──────────
 * Layout wrapper that renders a label row above any input child.
 *
 * Props:
 *   label    {string}   – visible label text shown above the input
 *   required {boolean}  – when true, renders a red asterisk (*) after the label
 *   hint     {string}   – optional muted note rendered beside the label
 *                         (e.g. "Cannot be edited later")
 *   children            – the actual input element placed below the label
 */
const FormField = ({ label, required, hint, children }) => (
  // flex-col stacks label on top of the input
  <div className="flex flex-col gap-1.5">

    {/* ── Label row ── */}
    <label className="flex items-center gap-1 text-sm font-medium text-gray-700 select-none">
      {label}

      {/* Red asterisk – only shown for required fields, matches screenshot */}
      {required && (
        <span className="text-red-500 text-sm leading-none">*</span>
      )}

      {/* Hint text – lighter, smaller, parenthesised, shown inline with label */}
      {hint && (
        <span className="ml-0.5 text-xs font-normal text-gray-400">
          ({hint})
        </span>
      )}
    </label>

    {/* ── Input slot – renders whatever child is passed in ── */}
    {children}
  </div>
);

/**
 * TextInput
 * ─────────
 * Controlled single-line text field.
 *
 * Props:
 *   value       {string}
 *   onChange    {(val: string) => void}  – receives the raw string value
 *   placeholder {string}
 */
const TextInput = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    value={value}
    // Unwrap the synthetic event → pass plain string to parent handler
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="
      w-full
      rounded-md
      border border-gray-200
      bg-white
      px-3 py-2
      text-sm text-gray-800
      placeholder:text-gray-400
      outline-none
      focus:border-indigo-500
      focus:ring-2 focus:ring-indigo-100
      transition-colors duration-150
    "
  />
);

/**
 * TextArea
 * ────────
 * Controlled multi-line text field.
 *
 * Props:
 *   value       {string}
 *   onChange    {(val: string) => void}
 *   placeholder {string}
 *   rows        {number}  – visible row count (default: 4)
 */
const TextArea = ({ value, onChange, placeholder, rows = 4 }) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    rows={rows}
    className="
      w-full
      rounded-md
      border border-gray-200
      bg-white
      px-3 py-2
      text-sm text-gray-800
      placeholder:text-gray-400
      outline-none
      resize-none
      focus:border-indigo-500
      focus:ring-2 focus:ring-indigo-100
      transition-colors duration-150
    "
  />
);

/**
 * SelectInput
 * ───────────
 * Styled native <select> with a custom ChevronDown icon overlay.
 * `appearance-none` strips the browser's default arrow so we can use our own.
 *
 * Props:
 *   value       {string}
 *   onChange    {(val: string) => void}
 *   options     {Array<{value: string, label: string}>}
 *   placeholder {string}  – empty/disabled first option shown as hint
 */
const SelectInput = ({ value, onChange, options, placeholder }) => (
  // `relative` provides positioning context for the absolute chevron icon
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        w-full
        appearance-none
        rounded-md
        border border-gray-200
        bg-white
        px-3 py-2
        pr-9
        text-sm text-gray-800
        outline-none
        cursor-pointer
        focus:border-indigo-500
        focus:ring-2 focus:ring-indigo-100
        transition-colors duration-150
      "
    >
      {/* Placeholder option – disabled so it can't be re-selected, hidden from dropdown list */}
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

    {/*
      Custom chevron icon
      pointer-events-none  → click events pass through to the underlying <select>
      absolute positioning  → overlays the right side of the select box
    */}
    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
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

  // ── Variant map: background, text, border, hover/active/focus states ──
  const variantMap = {
    // primary → solid indigo-600 matching the "Create" button in the screenshot
    primary: `
      bg-indigo-600 text-white border border-indigo-600
      hover:bg-indigo-700 hover:border-indigo-700
      active:bg-indigo-800
      focus:ring-2 focus:ring-indigo-300
    `,
    // secondary → white outlined button for cancel / secondary actions
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

/**
 * CreateKnowledgeBaseModal
 * ────────────────────────
 * Right-aligned slide-in panel modal replicating the uploaded screenshot.
 *
 * Layout breakdown (top → bottom):
 *   1. Fixed semi-transparent backdrop (z-50)
 *   2. Slide panel pinned to the right edge, full viewport height (z-[51])
 *      a. Header  – title, subtitle, × close button
 *      b. Form    – Name, Description, Vector Store, LLM Embedding Model fields
 *      c. Footer  – "Create" submit button, right-aligned
 *
 * Props:
 *   isOpen  {boolean}     – controls render / visibility
 *   onClose {() => void}  – called when backdrop or × is clicked
 */
const CreateKnowledgeBaseModal = ({ isOpen, onClose }) => {

  // ── Controlled form state ──────────────────────────────────────────────
  const [formData, setFormData] = useState({
    name:           '',                       // text input
    description:    '',                       // textarea
    vectorStore:    'qdrant',                 // select – default: Qdrant
    embeddingModel: 'text-embedding-ada-002', // select – default: ada-002
  });

  /**
   * handleChange
   * Curried setter – returns a handler for one specific field.
   * Usage: onChange={handleChange('name')}
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
      {/*
        ── 1. BACKDROP ──────────────────────────────────────────────────────
        Covers the full viewport with a 30 % black overlay.
        Clicking the backdrop calls onClose, matching expected UX.
        z-50 sits above all regular page content.
      */}
      <div
        className="fixed inset-0 bg-black/30 z-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/*
        ── 2. SLIDE PANEL ───────────────────────────────────────────────────
        Pinned to top / right / bottom so it spans full viewport height.
        w-[420px] matches the screenshot width exactly.
        z-[51] places it above the backdrop (z-50).
        shadow-2xl provides the deep drop shadow seen in the screenshot.
        flex flex-col allows the form's mt-auto to push the button to bottom.
        animate-slide-in uses the @keyframes injected via <style> below.
      */}
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

        {/* ── 2a. HEADER ───────────────────────────────────────────────── */}
        {/*
          border-b separates the header from the form body.
          px-6 pt-6 pb-4 matches the spacing visible in the screenshot.
        */}
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

            {/*
              Close button
              -mt-1 -mr-1 nudges the button flush with panel edge,
              matching the screenshot's top-right X position.
            */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="
                -mt-1 -mr-1
                p-1 rounded
                text-gray-400
                hover:text-gray-600 hover:bg-gray-100
                transition-colors duration-150
                cursor-pointer
              "
            >
              <X size={18} />
            </button>

          </div>
        </div>

        {/*
          ── 2b. FORM BODY ─────────────────────────────────────────────────
          flex-1       → expand to fill all remaining height between header & footer
          overflow-y-auto → scroll if viewport is too short for all fields
          flex flex-col → enables mt-auto on the button wrapper
          px-6 pt-5 pb-6 → comfortable padding matching the screenshot
        */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col px-6 pt-5 pb-6 overflow-y-auto"
        >
          {/* ── FIELDS STACK ──────────────────────────────────────────── */}
          {/*
            gap-5 adds consistent vertical space between each field group,
            exactly matching the screenshot's spacing rhythm.
          */}
          <div className="flex flex-col gap-5">

            {/*
              Field 1 – NAME
              required → shows red asterisk after the label
              hint     → "Cannot be edited later" as greyed parenthetical note
              Matches screenshot label: "Name (Cannot be edited later)*"
            */}
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

            {/*
              Field 2 – DESCRIPTION
              No required asterisk per the screenshot.
              rows={4} gives a tall enough textarea matching the screenshot.
            */}
            <FormField label="Description">
              <TextArea
                value={formData.description}
                onChange={handleChange('description')}
                placeholder="Description"
                rows={4}
              />
            </FormField>

            {/*
              Field 3 – VECTOR STORE
              required → red asterisk
              Default value "qdrant" renders as "Qdrant" in the dropdown,
              exactly matching the screenshot.
            */}
            <FormField label="Vector Store" required>
              <SelectInput
                value={formData.vectorStore}
                onChange={handleChange('vectorStore')}
                options={vectorStoreOptions}
                placeholder="Select Vector Store"
              />
            </FormField>

            {/*
              Field 4 – LLM EMBEDDING MODEL
              required → red asterisk
              Default "text-embedding-ada-002" matches the screenshot default.
            */}
            <FormField label="LLM Embedding Model" required>
              <SelectInput
                value={formData.embeddingModel}
                onChange={handleChange('embeddingModel')}
                options={embeddingModelOptions}
                placeholder="Select Embedding Model"
              />
            </FormField>

          </div>

          {/*
            ── 2c. SUBMIT BUTTON ─────────────────────────────────────────
            mt-auto pushes this div to the very bottom of the flex column,
            so the "Create" button sits in the bottom-right corner exactly
            as seen in the screenshot.
            pt-6 provides breathing room above the button.
            flex justify-end right-aligns the button.
          */}
          <div className="mt-auto pt-6 flex justify-end">
            <Button type="submit" variant="primary" size="md">
              Create
            </Button>
          </div>

        </form>
      </div>

      {/*
        ── SLIDE-IN ANIMATION ────────────────────────────────────────────────
        Tailwind JIT cannot generate arbitrary @keyframes.
        We inject a minimal <style> block for the panel entrance animation.
        The cubic-bezier matches a smooth deceleration (ease-out-expo feel).
      */}
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