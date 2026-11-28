import type { Doctor } from '../../types'

interface DoctorFormData {
  name: string
  specialization: string
  phone: string
  email: string
  consultationFee: string
  availableDays: string
  morningStart: string
  morningEnd: string
  eveningStart: string
  eveningEnd: string
}

interface DoctorManagementProps {
  doctors: Doctor[]
  editingDoctorId: number | null
  editDoctor: DoctorFormData
  newDoctor: DoctorFormData
  doctorMessage: string
  onEditChange: (field: keyof DoctorFormData, value: string) => void
  onNewChange: (field: keyof DoctorFormData, value: string) => void
  onEditDoctor: (doctor: Doctor) => void
  onDeleteDoctor: (id: number) => void
  onUpdateDoctor: (event: React.FormEvent<HTMLFormElement>) => void
  onRegisterDoctor: (event: React.FormEvent<HTMLFormElement>) => void
  onCancelEdit: () => void
}

export default function DoctorManagement({
  doctors,
  editingDoctorId,
  editDoctor,
  newDoctor,
  doctorMessage,
  onEditChange,
  onNewChange,
  onEditDoctor,
  onDeleteDoctor,
  onUpdateDoctor,
  onRegisterDoctor,
  onCancelEdit,
}: DoctorManagementProps) {
  const renderDoctorFields = (
  data: DoctorFormData,
  onChange: (field: keyof DoctorFormData, value: string) => void
) => (
    <>
      <label>Doctor Name</label>
      <input
        value={data.name}
        onChange={(e) => onChange('name', e.target.value)}
        placeholder="Enter full name"
        required
      />

      <label>Specialization</label>
      <input
        value={data.specialization}
        onChange={(e) => onChange('specialization', e.target.value)}
        placeholder="e.g. Cardiologist"
        required
      />

      <label>Phone Number</label>
      <input
        type="tel"
        value={data.phone}
        onChange={(e) => onChange('phone', e.target.value)}
        placeholder="Enter phone number"
        required
      />

      <label>Email</label>
      <input
        type="email"
        value={data.email}
        onChange={(e) => onChange('email', e.target.value)}
        placeholder="Enter email address"
        required
      />

      <label>Consultation Fee (₹)</label>
      <input
        type="number"
        min="0"
        value={data.consultationFee}
        onChange={(e) => onChange('consultationFee', e.target.value)}
        placeholder="Enter fee"
        required
      />

      <label>Available Days</label>
      <input
        value={data.availableDays}
        onChange={(e) => onChange('availableDays', e.target.value)}
        placeholder="e.g. Monday, Tuesday, Wednesday"
        required
      />

      <label>Morning Shift Start</label>
      <input
        type="time"
        value={data.morningStart}
        onChange={(e) => onChange('morningStart', e.target.value)}
        required
      />

      <label>Morning Shift End</label>
      <input
        type="time"
        value={data.morningEnd}
        onChange={(e) => onChange('morningEnd', e.target.value)}
        required
      />

      <label>Evening Shift Start</label>
      <input
        type="time"
        value={data.eveningStart}
        onChange={(e) => onChange('eveningStart', e.target.value)}
        required
      />

      <label>Evening Shift End</label>
      <input
        type="time"
        value={data.eveningEnd}
        onChange={(e) => onChange('eveningEnd', e.target.value)}
        required
      />
    </>
  )

  return (
    <section className="content-card">
      <div className="section-heading">
        <div>
          <h2>Doctor Management</h2>
          <p>View and manage registered doctors</p>
        </div>

        <span className="count-label">
          {doctors.length} Doctors
        </span>
      </div>

      <div className="patient-grid">
        {doctors.map((doctor) => (
          <div className="patient-card" key={doctor.id}>
            <div className="patient-avatar">⚕</div>

            <h3>{doctor.name}</h3>
            <p>Doctor ID: #{doctor.id}</p>

            <div className="patient-details">
              <span>Specialization: {doctor.specialization}</span>
              <span>Phone: {doctor.phone}</span>
              <span>Email: {doctor.email}</span>
              <span>Consultation Fee: ₹{doctor.consultationFee}</span>
            </div>

            <div className="card-actions">
              <button
                className="edit-btn"
                onClick={() => onEditDoctor(doctor)}
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => onDeleteDoctor(doctor.id)}
              >
                Delete
              </button>
            </div>

            {editingDoctorId === doctor.id && (
              <form
                onSubmit={onUpdateDoctor}
                className="booking-form"
              >
                <h3>Edit Doctor Details</h3>

                {renderDoctorFields(editDoctor, onEditChange)}

                <button type="submit" className="submit-btn">
                  Save Changes
                </button>

                <button
                  type="button"
                  className="edit-btn"
                  onClick={onCancelEdit}
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        ))}

        {doctors.length === 0 && (
          <p>No doctors registered yet.</p>
        )}
      </div>

      <div className="booking-form">
        <h2>Register New Doctor</h2>
        <p>Enter doctor details to add them to the hospital database.</p>

        <form onSubmit={onRegisterDoctor}>
          {renderDoctorFields(newDoctor, onNewChange)}

          <button className="submit-btn" type="submit">
            + Register Doctor
          </button>

          {doctorMessage && (
            <p className="form-message">{doctorMessage}</p>
          )}
        </form>
      </div>
    </section>
  )
}