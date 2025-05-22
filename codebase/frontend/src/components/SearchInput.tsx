import React from 'react'
import { styles } from '../styles/PaymentModal.styles'

type SearchInputProps = {
  value: string
  onChange: (value: string) => void
}

export const SearchInput: React.FC<SearchInputProps> = ({ value, onChange }) => {
  return (
    <div style={{ width: '400px' }}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by address..."
        style={{
          ...styles.input,
          marginBottom: '16px',
        }}
      />
    </div>
  )
}
