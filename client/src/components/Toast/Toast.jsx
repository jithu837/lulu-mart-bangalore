import './Toast.css'

export default function Toast({ message, visible }) {
  return (
    <div className={`toast-notification ${visible ? 'visible' : ''}`} role="status" aria-live="polite">
      <span className="toast-icon" aria-hidden="true">✓</span>
      <span className="toast-text">{message}</span>
    </div>
  )
}
