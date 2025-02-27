import { FC } from 'react'

const companies = JSON.parse(import.meta.env.VITE_COMPANIES)

interface CompanySelectorProps {
  onSelect: (company: string) => void
  value: string
}

const CompanySelector: FC<CompanySelectorProps> = ({ onSelect, value }) => {
  return (
    <select value={value} onChange={(e) => onSelect(e.target.value)}>
      <option value="">Select a company</option>
      {companies.map((company: string) => (
        <option key={company} value={company}>
          {company}
        </option>
      ))}
    </select>
  )
}

export default CompanySelector
