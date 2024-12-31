import { useModal } from '../../context/Modal';
import './ProjectModals.css';

export function DeleteConfirmationModal({ itemType, itemId, itemName, onDelete }) {
  const { closeModal } = useModal();

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/${itemType}s/${itemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        if (onDelete) onDelete();
        closeModal();
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <div className="delete-confirmation-modal">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to delete {itemType} "{itemName}"?</p>
      <p>This action cannot be undone.</p>

      <div className="modal-actions">
        <button onClick={handleDelete} className="delete-button">
          Delete {itemType}
        </button>
        <button onClick={closeModal} className="cancel-button">
          Cancel
        </button>
      </div>
    </div>
  );
}
