import { X } from 'lucide-react';
import { useState } from 'react';
import FormField from './FormField';
import TextInput from './TextInput';
import TextArea from './TextArea';
import SelectInput from './SelectInput';
import Button from './Button';

const vectorStoreOptions = [
  { value: 'qdrant', label: 'Qdrant' },
  { value: 'pinecone', label: 'Pinecone' },
  { value: 'weaviate', label: 'Weaviate' },
  { value: 'chromadb', label: 'ChromaDB' },
];

const embeddingModelOptions = [
  { value: 'text-embedding-ada-002', label: 'text-embedding-ada-002' },
  { value: 'text-embedding-3-small', label: 'text-embedding-3-small' },
  { value: 'text-embedding-3-large', label: 'text-embedding-3-large' },
];

const CreateKnowledgeBaseModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    vectorStore: 'qdrant',
    embeddingModel: 'text-embedding-ada-002',
  });

  const handleChange = (field) => (value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Creating Knowledge Base:', formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/30 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Panel - Right-aligned slide-in */}
      <div className="fixed top-0 right-0 bottom-0 w-[420px] bg-white z-50 shadow-2xl flex flex-col animate-slide-in">
        {/* Header */}
        <div className="p-6 pb-2">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                Create New Knowledge Base
              </h2>
              <p className="text-[13px] text-text-secondary mt-1">
                Best for quick answers from documents, websites and text files.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text-secondary p-1 rounded transition-colors -mt-1 -mr-1 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col px-6 pt-4">
          <div className="flex flex-col gap-5">
            {/* Name Field */}
            <FormField label="Name" required hint="Cannot be edited later">
              <TextInput
                value={formData.name}
                onChange={handleChange('name')}
                placeholder="Name"
              />
            </FormField>

            {/* Description Field */}
            <FormField label="Description">
              <TextArea
                value={formData.description}
                onChange={handleChange('description')}
                placeholder="Description"
                rows={4}
              />
            </FormField>

            {/* Vector Store Field */}
            <FormField label="Vector Store" required>
              <SelectInput
                value={formData.vectorStore}
                onChange={handleChange('vectorStore')}
                options={vectorStoreOptions}
                placeholder="Select Vector Store"
              />
            </FormField>

            {/* LLM Embedding Model Field */}
            <FormField label="LLM Embedding Model" required>
              <SelectInput
                value={formData.embeddingModel}
                onChange={handleChange('embeddingModel')}
                options={embeddingModelOptions}
                placeholder="Select Embedding Model"
              />
            </FormField>
          </div>

          {/* Submit Button - Bottom right */}
          <div className="mt-auto pb-6 pt-6 flex justify-end">
            <Button type="submit" variant="primary" size="md">
              Create
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateKnowledgeBaseModal;
