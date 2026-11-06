import './EmptyState.css';

function EmptyState({ title, message }) {
  return (
    <div className="empty-state">
      <p className="empty-title">{title}</p>
      <p className="empty-message">{message}</p>
    </div>
  );
}

export default EmptyState;
