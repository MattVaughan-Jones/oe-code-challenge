import React from 'react'

type EnergyTypeFilterProps = {
  options: {
    value: string
    label: string
  }[]
  value: string
  onChange: (value: string) => void
  label: string
}

export const EnergyTypeFilter: React.FC<EnergyTypeFilterProps> = ({
  options,
  value,
  onChange,
  label,
}) => {
  return (
    <div>
      <label htmlFor="energy-type-select">{label}</label>
      <select id="energy-type-select" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
