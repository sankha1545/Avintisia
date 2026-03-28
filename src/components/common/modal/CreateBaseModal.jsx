"use client";

import { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";

import FormField from "../form/FormField";
import TextInput from "../ui/TextInput";
import TextArea from "../ui/TextArea";
import SelectInput from "../ui/SelectInput";
import Button from "../ui/Button";
import Icons from "../icons/Icons";

const CreateBaseModal = ({
  isOpen,
  onClose,
  onSubmit,
  title = "Create Item",
  subtitle = "Fill the details below",
  fields = [],
  submitLabel = "Create",
  initialState = {},
}) => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [visibility, setVisibility] = useState({});
  const modalRef = useRef(null);

  /* =========================
     🔹 RESET STATE ON CLOSE
  ========================= */
  useEffect(() => {
    if (!isOpen) {
      setForm(initialState);
      setErrors({});
      setVisibility({});
    }
  }, [isOpen, initialState]);

  /* =========================
     🔹 PREVENT BACKGROUND SCROLL
  ========================= */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  /* =========================
     🔹 ESC KEY CLOSE
  ========================= */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  /* =========================
     🔹 UPDATE FIELD
  ========================= */
  const updateField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /* =========================
     🔹 VALIDATION
  ========================= */
  const validate = () => {
    const newErrors = {};

    fields.forEach((field) => {
      if (field.required && !form[field.name]?.toString().trim()) {
        newErrors[field.name] = "Required";
      }
    });

    return newErrors;
  };

  /* =========================
     🔹 SUBMIT HANDLER
  ========================= */
  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    onSubmit(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* =========================
          🔥 OVERLAY (FIXED)
      ========================= */}
      <div
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* =========================
          🔥 MODAL WRAPPER
      ========================= */}
      <div className="fixed inset-0 z-[110] flex justify-end sm:items-end md:items-stretch">

        {/* =========================
            🔹 DRAWER
        ========================= */}
        <div
          ref={modalRef}
          className="
            w-full
            sm:h-[90%] sm:rounded-t-2xl
            md:h-full md:rounded-none
            md:max-w-md lg:max-w-lg
            bg-white shadow-2xl
            flex flex-col
            animate-slide-in
          "
        >
          {/* =========================
              🔹 HEADER
          ========================= */}
          <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-gray-100 sm:px-6">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                {title}
              </h2>
              <p className="mt-1 text-xs text-gray-400">
                {subtitle}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1 transition rounded hover:bg-gray-100"
            >
              <X size={18} />
            </button>
          </div>

          {/* =========================
              🔹 FORM
          ========================= */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col flex-1 overflow-hidden"
          >
            {/* =========================
                🔹 SCROLLABLE CONTENT
            ========================= */}
            <div className="flex-1 px-5 py-5 space-y-5 overflow-y-auto sm:px-6">

              {fields.map((field) => {
                const value = form[field.name] || "";

                /* ===== TEXT INPUT ===== */
                if (field.type === "text") {
                  return (
                    <FormField
                      key={field.name}
                      label={field.label}
                      required={field.required}
                      error={errors[field.name]}
                    >
                      <TextInput
                        value={value}
                        placeholder={field.placeholder}
                        onChange={(v) => updateField(field.name, v)}
                      />
                    </FormField>
                  );
                }

                /* ===== PASSWORD ===== */
                if (field.type === "password") {
                  const isVisible = visibility[field.name];

                  return (
                    <FormField
                      key={field.name}
                      label={field.label}
                      required={field.required}
                      error={errors[field.name]}
                    >
                      <div className="relative">
                        <TextInput
                          type={isVisible ? "text" : "password"}
                          value={value}
                          placeholder={field.placeholder}
                          onChange={(v) => updateField(field.name, v)}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setVisibility((prev) => ({
                              ...prev,
                              [field.name]: !prev[field.name],
                            }))
                          }
                          className="absolute text-gray-400 -translate-y-1/2 right-2 top-1/2"
                        >
                          <Icons
                            name={isVisible ? "eyeOff" : "eye"}
                            size={14}
                          />
                        </button>
                      </div>
                    </FormField>
                  );
                }

                /* ===== SELECT ===== */
                if (field.type === "select") {
                  return (
                    <FormField
                      key={field.name}
                      label={field.label}
                      required={field.required}
                      error={errors[field.name]}
                    >
                      <SelectInput
                        value={value}
                        onChange={(v) => updateField(field.name, v)}
                        options={field.options || []}
                      />
                    </FormField>
                  );
                }

                /* ===== TEXTAREA ===== */
                if (field.type === "textarea") {
                  return (
                    <FormField
                      key={field.name}
                      label={field.label}
                      required={field.required}
                      error={errors[field.name]}
                    >
                      <TextArea
                        value={value}
                        placeholder={field.placeholder}
                        onChange={(v) => updateField(field.name, v)}
                      />
                    </FormField>
                  );
                }

                return null;
              })}
            </div>

            {/* =========================
                🔹 FOOTER
            ========================= */}
            <div className="flex justify-end px-5 py-4 bg-white border-t border-gray-100 sm:px-6">
              <Button type="submit" className="w-full sm:w-auto">
                {submitLabel}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* =========================
          🔹 ANIMATION
      ========================= */}
      <style>{`
        @keyframes slideInFromRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in {
          animation: slideInFromRight 0.3s ease;
        }
      `}</style>
    </>
  );
};

export default CreateBaseModal;