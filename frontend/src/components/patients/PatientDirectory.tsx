import type { Patient } from '../../types'

interface PatientDirectoryProps {
  patients: Patient[]
  searchTerm: string
  userRole: string
  onSearchChange: (value: string) => void
  onEdit: (patient: Patient) => void
  onDelete: (patient: Patient) => void
  paymentMessage: string
}

export default function PatientDirectory({
  patients,
  searchTerm,
  userRole,
  onSearchChange,
  onEdit,
  onDelete,
  paymentMessage,
}: PatientDirectoryProps) {
  const filteredPatients = patients.filter((patient) =>
    `${patient.name} ${patient.phone} ${patient.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

  return (
    <section className="content-card">
      <div className="section-heading">
        <div>
          <h2>Patient Directory</h2>
          <p>All registered patients</p>
        </div>

        <span className="count-label">
          {patients.length} Patients
        </span>
      </div>

      <input
        type="text"
        placeholder="Search by name, phone, or email..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />

      {paymentMessage && (
        <p className="form-message">{paymentMessage}</p>
      )}

      <div className="patient-grid">
        {filteredPatients.map((patient) => (
          <div className="patient-card" key={patient.id}>
            <div className="patient-avatar">
              {patient.name.charAt(0).toUpperCase()}
            </div>

            <h3>{patient.name}</h3>
            <p>Patient ID: #{patient.id}</p>

            <div className="patient-details">
              <span>Age: {patient.age}</span>
              <span>Gender: {patient.gender}</span>
              <span>Phone: {patient.phone}</span>
              <span>Email: {patient.email}</span>
            </div>

            <button
              type="button"
              onClick={() => onEdit({ ...patient })}
            >
              Edit
            </button>

            {userRole === 'ADMIN' && (
              <button
                type="button"
                onClick={() => onDelete(patient)}
              >
                Delete
              </button>
            )}
          </div>
        ))}

        {patients.length === 0 && (
          <p>No patients registered yet.</p>
        )}
      </div>
    </section>
  )
}