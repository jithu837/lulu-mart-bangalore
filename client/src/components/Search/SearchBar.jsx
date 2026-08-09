import { FiSearch, FiX } from 'react-icons/fi'
import './SearchBar.css'

export default function SearchBar({ value, onChange, placeholder = 'Search ice creams…' }) {
  return (
    <div className="searchbar">
      <FiSearch />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button aria-label="Clear search" onClick={() => onChange('')}>
          <FiX />
        </button>
      )}
    </div>
  )
}
