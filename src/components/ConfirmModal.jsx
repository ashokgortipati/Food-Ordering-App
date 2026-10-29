import Modal from "./Modal";
import { AlertTriangle } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed? This action cannot be undone.",
  confirmLabel = "Delete",
  confirmVariant = "danger",
  isLoading = false
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="460px">
      <div className="confirm-modal-content">
        <div className={`confirm-icon-box ${confirmVariant}`}>
          <AlertTriangle size={32} />
        </div>
        <div className="confirm-text">
          <p>{message}</p>
        </div>
      </div>
      <div className="modal-actions-footer">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="button"
          className={`btn btn-${confirmVariant}`}
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
