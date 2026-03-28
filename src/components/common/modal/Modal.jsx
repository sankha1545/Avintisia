import Icons from "../icons/Icons";

const Modal = ({ title, onClose, children }) => {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5">
          <h3 className="text-base font-semibold">{title}</h3>
          <button onClick={onClose}>
            <Icons name="x" size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 pt-4 pb-5">{children}</div>
      </div>
    </div>
  );
};

export default Modal;