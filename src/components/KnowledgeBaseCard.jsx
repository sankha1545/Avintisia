import { MoreVertical } from 'lucide-react';

const KnowledgeBaseCard = ({ title, description, createdOn }) => {
  return (
    <div className="bg-card-bg border border-card-border rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow duration-200 cursor-pointer">
      {/* Card Header */}
      <div>
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-base font-semibold text-text-primary">{title}</h3>
          <button className="text-text-muted hover:text-text-secondary p-0.5 rounded transition-colors -mt-0.5 -mr-1 cursor-pointer">
            <MoreVertical size={18} />
          </button>
        </div>

        {/* Description */}
        <p className="text-[13px] text-text-secondary leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>

      {/* Footer - Created Date */}
      <div className="mt-4 pt-3 border-t border-card-border">
        <span className="text-xs text-text-muted">Created On: {createdOn}</span>
      </div>
    </div>
  );
};

export default KnowledgeBaseCard;
