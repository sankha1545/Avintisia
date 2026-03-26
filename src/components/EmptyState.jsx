import { FileText } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-24">
      {/* Document Icon Stack */}
      <div className="relative mb-4">
        <div className="w-16 h-20 rounded-lg border-2 border-gray-200 bg-gray-50 absolute -left-2 -top-1 transform -rotate-6" />
        <div className="w-16 h-20 rounded-lg border-2 border-gray-200 bg-gray-50 absolute left-2 -top-1 transform rotate-6" />
        <div className="w-16 h-20 rounded-lg border-2 border-gray-300 bg-white relative z-10 flex items-center justify-center">
          <FileText size={28} className="text-text-muted" />
        </div>
      </div>

      {/* Text */}
      <p className="text-text-secondary text-sm mt-4">No Knowledge Bases Found</p>
    </div>
  );
};

export default EmptyState;
