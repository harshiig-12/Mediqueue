import type { Patient } from '../../types'

interface PatientEditFormProps {
  patient: Patient
  onChange: (patient: Patient) => void
  onSave: () => void
  onCancel: () => void
}

export default function PatientEditForm({
  patient,
  onChange,
  onSave,
  onCancel,
}: PatientEditFormProps) {
  const updateField = (field: keyof Patient, value: string | number) => {
    onChange({ ...patient, [field]: value })
  }

  return (
    <section className="content-card">
      <div className="section-heading">
        <h2>Edit Patient Details</h2>
      </div>

      <form
        className="booking-form"
        onSubmit={(e) => {
          e.preventDefault()
          onSave()
        }}
      >
        <label>Name</label>
        <input
          value={patient.name}
          onChange={(e) => updateField('name', e.target.value)}
          required
        />

        <label>Age</label>
        <input
          type="number"
          value={patient.age}
          onChange={(e) => updateField('age', Number(e.target.value))}
          required
        />

        <label>Gender</label>
        <input
          value={patient.gender}
          onChange={(e) => updateField('gender', e.target.value)}
          required
        />

        <label>Phone</label>
        <input
          value={patient.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          required
        />

        <label>Email</label>
        <input
          type="email"
          value={patient.email}
          onChange={(e) => updateField('email', e.target.value)}
          required
        />

        <label>Date of Birth</label>
        <input
          type="date"
          value={patient.dateOfBirth || ''}
          onChange={(e) => updateField('dateOfBirth', e.target.value)}
        />

        <button type="submit">Save Changes</button>

        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </section>
  )
}