import type { Patient, Doctor, Appointment } from '../../types'
import AppointmentTable from './AppointmentTable'

interface AppointmentManagementProps {
  appointments: Appointment[]
  patients: Patient[]
  doctors: Doctor[]
  selectedDoctorFilter: string
  selectedScheduleDate: string
  patientId: string
  selectedDoctorId: string
  selectedDate: string
  appointmentDateTime: string
  availableSlots: string[]
  appointmentType: string
  reason: string
  formatDate: (date: string) => string
  onDoctorFilterChange: (value: string) => void
  onScheduleDateChange: (value: string) => void
  onPatientChange: (value: string) => void
  onDoctorChange: (value: string) => void
  onDateChange: (value: string) => void
  onTimeChange: (value: string) => void
  onAppointmentTypeChange: (value: string) => void
  onReasonChange: (value: string) => void
  onBooking: (event: React.FormEvent<HTMLFormElement>) => void
  onCancel: (id: number) => void
  onComplete: (id: number) => void
  onReschedule: (id: number) => void
}

export default function AppointmentManagement({
  appointments,
  patients,
  doctors,
  selectedDoctorFilter,
  selectedScheduleDate,
  patientId,
  selectedDoctorId,
  selectedDate,
  appointmentDateTime,
  availableSlots,
  appointmentType,
  reason,
  formatDate,
  onDoctorFilterChange,
  onScheduleDateChange,
  onPatientChange,
  onDoctorChange,
  onDateChange,
  onTimeChange,
  onAppointmentTypeChange,
  onReasonChange,
  onBooking,
  onCancel,
  onComplete,
  onReschedule,
}: AppointmentManagementProps) {
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesDoctor =
      selectedDoctorFilter === 'All' ||
      String(appointment.doctor?.id) === selectedDoctorFilter

    const matchesDate =
      appointment.appointmentDateTime?.slice(0, 10) ===
      selectedScheduleDate

    return matchesDoctor && matchesDate
  })

  const duration =
    appointmentType === 'NEW_PATIENT' ? 30 :
    appointmentType === 'FOLLOW_UP' ? 15 :
    appointmentType === 'COMPLEX' ? 45 : 20

  return (
    <section className="content-card">
      <div className="section-heading">
        <div>
          <h2>Appointment Management</h2>
          <p>View all hospital appointments</p>
        </div>

        <div className="filter-container">
          <label>Filter by Doctor:</label>
          <select
            value={selectedDoctorFilter}
            onChange={(e) => onDoctorFilterChange(e.target.value)}
          >
            <option value="All">All Doctors</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={String(doctor.id)}>
                {doctor.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-container">
          <label>Schedule Date:</label>
          <input
            type="date"
            value={selectedScheduleDate}
            onChange={(e) => onScheduleDateChange(e.target.value)}
          />
        </div>

        <span className="count-label">
          {filteredAppointments.length} Appointments
        </span>
      </div>

      <AppointmentTable
        appointments={filteredAppointments}
        formatDate={formatDate}
        onCancel={onCancel}
        onComplete={onComplete}
        onReschedule={onReschedule}
      />

      <div className="booking-form">
        <h2>Book New Appointment</h2>
        <p>Schedule an appointment for a registered patient.</p>

        <form onSubmit={onBooking}>
          <label>Patient</label>
          <select
            value={patientId}
            onChange={(e) => onPatientChange(e.target.value)}
            required
          >
            <option value="">Select a patient</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name} (ID: {patient.id})
              </option>
            ))}
          </select>

          <label>Doctor</label>
          <select
            value={selectedDoctorId}
            onChange={(e) => onDoctorChange(e.target.value)}
            required
          >
            <option value="">Select a Doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} - {doctor.specialization}
              </option>
            ))}
          </select>

          <label>Appointment Date</label>
          <input
            type="date"
            value={selectedDate}
            min={new Date().toLocaleDateString('en-CA')}
            onChange={(e) => onDateChange(e.target.value)}
            required
          />

          <label>Available Time Slots</label>
          <select
            value={appointmentDateTime}
            onChange={(e) => onTimeChange(e.target.value)}
            required
          >
            <option value="">Select a time slot</option>
            {availableSlots.map((slot) => (
              <option key={slot} value={slot}>
                {new Date(slot).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </option>
            ))}
          </select>

          <label>Appointment Type</label>
          <select
            value={appointmentType}
            onChange={(e) => onAppointmentTypeChange(e.target.value)}
            required
          >
            <option value="NEW_PATIENT">New Patient (30 min)</option>
            <option value="FOLLOW_UP">Follow-up (15 min)</option>
            <option value="GENERAL">General Consultation (20 min)</option>
            <option value="COMPLEX">Complex Consultation (45 min)</option>
          </select>

          <p>Estimated Duration: {duration} minutes</p>

          {selectedDate && availableSlots.length === 0 && (
            <p>No available slots for this date. Try another date.</p>
          )}

          <label>Reason for Visit</label>
          <input
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            placeholder="e.g. General Checkup"
            required
          />

          <button className="submit-btn" type="submit">
            + Book Appointment
          </button>
        </form>
      </div>
    </section>
  )
}