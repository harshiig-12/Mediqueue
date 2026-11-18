
import { useEffect, useState, type FormEvent } from 'react'
import './App.css'

const API = 'http://localhost:8080/api'

interface Patient {
  id: number
  name: string
  age: number
  gender: string
  phone: string
  email: string
  dateOfBirth?: string
}
interface Doctor {
  id: number
  name: string
  specialization: string
  phone: string
  email: string
  consultationFee: number
}

interface Appointment {
  id: number
  doctorName: string
  appointmentDateTime: string
  reason: string
  status: string
  patient: Patient
}


async function fetchDashboardData() {
  const [patientResponse, appointmentResponse, doctorResponse] =
    await Promise.all([
      fetch(`${API}/patients`),
      fetch(`${API}/appointments`),
      fetch(`${API}/doctors`)
    ])

  if (
    !patientResponse.ok ||
    !appointmentResponse.ok ||
    !doctorResponse.ok
  ) {
    throw new Error('Unable to load data from the server.')
  }

  const patients: Patient[] = await patientResponse.json()
  const appointments: Appointment[] = await appointmentResponse.json()
  const doctors: Doctor[] = await doctorResponse.json()

  return { patients, appointments, doctors }
}

 

function App() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [newDoctorName, setNewDoctorName] = useState('')
const [newSpecialization, setNewSpecialization] = useState('')
const [newDoctorPhone, setNewDoctorPhone] = useState('')
const [newDoctorEmail, setNewDoctorEmail] = useState('')
const [newConsultationFee, setNewConsultationFee] = useState('')
const [doctorMessage, setDoctorMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)

  const [doctorName, setDoctorName] = useState('')
  const [patientId, setPatientId] = useState('')
  const [appointmentDateTime, setAppointmentDateTime] = useState('')
  const [reason, setReason] = useState('')
  const [message, setMessage] = useState('')

  const [activePage, setActivePage] = useState('Dashboard')

  // Patient registration form
  const [newName, setNewName] = useState('')
  const [newAge, setNewAge] = useState('')
  const [newGender, setNewGender] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newDateOfBirth, setNewDateOfBirth] = useState('')
  const [registrationMessage, setRegistrationMessage] = useState('')

  useEffect(() => {
    let cancelled = false

    fetchDashboardData()
      .then((data) => {
        if (!cancelled) {
          setPatients(data.patients)
          setAppointments(data.appointments)
          setDoctors(data.doctors)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Something went wrong.'
          )
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const loadData = async () => {
    try {
      setError('')
      const data = await fetchDashboardData()

      setPatients(data.patients)
      setAppointments(data.appointments)
      setDoctors(data.doctors)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong.'
      )
    }
  }

  // Register a new patient
  const handlePatientRegistration = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()
    setRegistrationMessage('')

    try {
      const response = await fetch(`${API}/patients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newName,
          age: Number(newAge),
          gender: newGender,
          phone: newPhone,
          email: newEmail,
          dateOfBirth: newDateOfBirth
        })
      })

      if (!response.ok) {
        throw new Error('Could not register patient.')
      }

      setRegistrationMessage('Patient registered successfully!')

      setNewName('')
      setNewAge('')
      setNewGender('')
      setNewPhone('')
      setNewEmail('')
      setNewDateOfBirth('')

      await loadData()
    } catch (err) {
      setRegistrationMessage(
        err instanceof Error ? err.message : 'Registration failed.'
      )
    }
  }

  const handleDoctorRegistration = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  setDoctorMessage('')

  try {
    const response = await fetch(`${API}/doctors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newDoctorName,
        specialization: newSpecialization,
        phone: newDoctorPhone,
        email: newDoctorEmail,
        consultationFee: Number(newConsultationFee)
      })
    })

    if (!response.ok) throw new Error('Could not register doctor.')

    setDoctorMessage('Doctor registered successfully!')
    setNewDoctorName('')
    setNewSpecialization('')
    setNewDoctorPhone('')
    setNewDoctorEmail('')
    setNewConsultationFee('')

    await loadData()
  } catch (err) {
    setDoctorMessage(
      err instanceof Error ? err.message : 'Registration failed.'
    )
  }
}

  // Edit an existing patient
  const handlePatientUpdate = async () => {
    if (!editingPatient) return

    try {
      const response = await fetch(
        `${API}/patients/${editingPatient.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(editingPatient)
        }
      )

      if (!response.ok) {
        throw new Error('Could not update patient.')
      }

      setMessage('Patient updated successfully!')
      setEditingPatient(null)
      await loadData()
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : 'Update failed.'
      )
    }
  }

  // Book an appointment
  const handleBooking = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage('')

    try {
      const response = await fetch(
        `${API}/appointments/${patientId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            doctorName,
            appointmentDateTime,
            reason,
            status: 'SCHEDULED'
          })
        }
      )

      if (!response.ok) {
        throw new Error('Could not book appointment.')
      }

      setMessage('Appointment booked successfully!')

      setDoctorName('')
      setPatientId('')
      setAppointmentDateTime('')
      setReason('')

      await loadData()
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : 'Booking failed.'
      )
    }
  }

  // Cancel an appointment without deleting it
  const handleCancel = async (id: number) => {
    const confirmed = window.confirm(
      'Are you sure you want to cancel this appointment?'
    )

    if (!confirmed) return

    try {
      setError('')
      setMessage('')

      const response = await fetch(
        `${API}/appointments/${id}/cancel`,
        {
          method: 'PUT'
        }
      )

      if (!response.ok) {
        throw new Error('Could not cancel appointment.')
      }

      setMessage('Appointment cancelled successfully!')
      await loadData()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Cancellation failed.'
      )
    }
  }

  // Mark an appointment as completed
  const handleComplete = async (id: number) => {
    try {
      setError('')
      setMessage('')

      const response = await fetch(
        `${API}/appointments/${id}/complete`,
        {
          method: 'PUT'
        }
      )

      if (!response.ok) {
        throw new Error('Could not complete appointment.')
      }

      setMessage('Appointment marked as completed!')
      await loadData()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Completion failed.'
      )
    }
  }

  // Delete a patient
  const handlePatientDelete = async (patient: Patient) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${patient.name}?`
    )

    if (!confirmed) return

    try {
      setError('')
      const response = await fetch(
        `${API}/patients/${patient.id}`,
        {
          method: 'DELETE'
        }
      )

      if (!response.ok) {
        throw new Error('Could not delete patient.')
      }

      setMessage('Patient deleted successfully!')
      await loadData()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Delete failed.'
      )
    }
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })

  const scheduledCount = appointments.filter(
    (appointment) => appointment.status === 'SCHEDULED'
  ).length

  const completedCount = appointments.filter(
    (appointment) => appointment.status === 'COMPLETED'
  ).length

  const cancelledCount = appointments.filter(
    (appointment) => appointment.status === 'CANCELLED'
  ).length

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">✚</div>
          <div>
            <h2>MediQueue</h2>
            <span>Hospital Management</span>
          </div>
        </div>

        <p className="menu-heading">MENU</p>

        {[
          'Dashboard',
          'Patients',
          'Register Patient',
          'Doctors',
          'Appointments'
        ].map((page) => (
          <button
            key={page}
            className={`nav-item ${activePage === page ? 'active' : ''}`}
            onClick={() => {
              setActivePage(page)
              setMessage('')
              setError('')
            }}
          >
            <span>
              {page === 'Dashboard' ? '▦' :
                page === 'Patients' ? '♙' :
                  page === 'Register Patient' ? '+' :
page === 'Doctors' ? '⚕' : '▣'}
            </span>
            {page}
          </button>
        ))}

        <div className="sidebar-bottom">
          <div className="admin-avatar">A</div>
          <div>
            <strong>Administrator</strong>
            <span>System Manager</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="breadcrumb">MediQueue / {activePage}</span>
            <h1>{activePage}</h1>
          </div>

          <button className="refresh-btn" onClick={loadData}>
            ↻ Refresh
          </button>
        </header>

        {error && <div className="error-message">{error}</div>}

        {message && <p className="form-message">{message}</p>}

        {loading ? (
          <p className="loading">Loading MediQueue data...</p>
        ) : (
          <>
            {/* DASHBOARD */}
            {activePage === 'Dashboard' && (
              <>
                <section className="welcome-banner">
                  <div>
                    <span>HOSPITAL MANAGEMENT SYSTEM</span>
                    <h2>Welcome to MediQueue 👋</h2>
                    <p>
                      Manage your patients and appointments from one place.
                    </p>
                  </div>
                  <div className="welcome-symbol">✚</div>
                </section>

                <section className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon blue">♙</div>
                    <p>Total Patients</p>
                    <h2>{patients.length}</h2>
                    <span>Registered patients</span>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon purple">▣</div>
                    <p>Total Appointments</p>
                    <h2>{appointments.length}</h2>
                    <span>All recorded appointments</span>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon green">✓</div>
                    <p>Scheduled</p>
                    <h2>{scheduledCount}</h2>
                    <span>Scheduled appointments</span>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon green">✓</div>
                    <p>Completed</p>
                    <h2>{completedCount}</h2>
                    <span>Completed appointments</span>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon purple">×</div>
                    <p>Cancelled</p>
                    <h2>{cancelledCount}</h2>
                    <span>Cancelled appointments</span>
                  </div>
                </section>

                <section className="content-card">
                  <div className="section-heading">
                    <div>
                      <h2>Recent Appointments</h2>
                      <p>Latest appointments registered in the system</p>
                    </div>

                    <button
                      className="text-btn"
                      onClick={() => setActivePage('Appointments')}
                    >
                      View all →
                    </button>
                  </div>

                  <AppointmentTable
                    appointments={appointments.slice(0, 5)}
                    formatDate={formatDate}
                    onCancel={handleCancel}
                    onComplete={handleComplete}
                  />
                </section>
              </>
            )}

            {/* PATIENT DIRECTORY */}
            {activePage === 'Patients' && (
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />

                <div className="patient-grid">
                  {patients
                    .filter((patient) =>
                      `${patient.name} ${patient.phone} ${patient.email}`
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((patient) => (
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
                          onClick={() => setEditingPatient({ ...patient })}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handlePatientDelete(patient)}
                        >
                          Delete
                        </button>
                      </div>
                    ))}

                  {patients.length === 0 && (
                    <p>No patients registered yet.</p>
                  )}
                </div>
              </section>
            )}

            {/* EDIT PATIENT */}
            {editingPatient && (
              <section className="content-card">
                <div className="section-heading">
                  <h2>Edit Patient Details</h2>
                </div>

                <form
                  className="booking-form"
                  onSubmit={(e) => {
                    e.preventDefault()
                    handlePatientUpdate()
                  }}
                >
                  <label>Name</label>
                  <input
                    value={editingPatient.name}
                    onChange={(e) =>
                      setEditingPatient({
                        ...editingPatient,
                        name: e.target.value
                      })
                    }
                    required
                  />

                  <label>Age</label>
                  <input
                    type="number"
                    value={editingPatient.age}
                    onChange={(e) =>
                      setEditingPatient({
                        ...editingPatient,
                        age: Number(e.target.value)
                      })
                    }
                    required
                  />

                  <label>Gender</label>
                  <input
                    value={editingPatient.gender}
                    onChange={(e) =>
                      setEditingPatient({
                        ...editingPatient,
                        gender: e.target.value
                      })
                    }
                    required
                  />

                  <label>Phone</label>
                  <input
                    value={editingPatient.phone}
                    onChange={(e) =>
                      setEditingPatient({
                        ...editingPatient,
                        phone: e.target.value
                      })
                    }
                    required
                  />

                  <label>Email</label>
                  <input
                    type="email"
                    value={editingPatient.email}
                    onChange={(e) =>
                      setEditingPatient({
                        ...editingPatient,
                        email: e.target.value
                      })
                    }
                    required
                  />

                  <label>Date of Birth</label>
                  <input
                    type="date"
                    value={editingPatient.dateOfBirth || ''}
                    onChange={(e) =>
                      setEditingPatient({
                        ...editingPatient,
                        dateOfBirth: e.target.value
                      })
                    }
                  />

                  <button type="submit">Save Changes</button>

                  <button
                    type="button"
                    onClick={() => setEditingPatient(null)}
                  >
                    Cancel
                  </button>
                </form>
              </section>
            )}

            {/* REGISTER PATIENT */}
            {activePage === 'Register Patient' && (
              <section className="content-card">
                <div className="section-heading">
                  <div>
                    <h2>Register New Patient</h2>
                    <p>
                      Enter patient details to add them to the hospital database.
                    </p>
                  </div>
                </div>

                <div className="booking-form">
                  <form onSubmit={handlePatientRegistration}>
                    <label>Patient Name</label>
                    <input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Enter full name"
                      required
                    />

                    <label>Age</label>
                    <input
                      type="number"
                      min="0"
                      max="120"
                      value={newAge}
                      onChange={(e) => setNewAge(e.target.value)}
                      placeholder="Enter age"
                      required
                    />

                    <label>Gender</label>
                    <select
                      value={newGender}
                      onChange={(e) => setNewGender(e.target.value)}
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>

                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="Enter phone number"
                      required
                    />

                    <label>Email</label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="Enter email address"
                      required
                    />

                    <label>Date of Birth</label>
                    <input
                      type="date"
                      value={newDateOfBirth}
                      onChange={(e) => setNewDateOfBirth(e.target.value)}
                      required
                    />

                    <button className="submit-btn" type="submit">
                      + Register Patient
                    </button>

                    {registrationMessage && (
                      <p className="form-message">
                        {registrationMessage}
                      </p>
                    )}
                  </form>
                </div>
              </section>
            )}


{activePage === 'Doctors' && (
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
        </div>
      ))}

      {doctors.length === 0 && (
        <p>No doctors registered yet.</p>
      )}
    </div>
    <div className="booking-form">
  <h2>Register New Doctor</h2>
  <p>Enter doctor details to add them to the hospital database.</p>

  <form onSubmit={handleDoctorRegistration}>
    <label>Doctor Name</label>
    <input
      value={newDoctorName}
      onChange={(e) => setNewDoctorName(e.target.value)}
      placeholder="Enter full name"
      required
    />

    <label>Specialization</label>
    <input
      value={newSpecialization}
      onChange={(e) => setNewSpecialization(e.target.value)}
      placeholder="e.g. Cardiologist"
      required
    />

    <label>Phone Number</label>
    <input
      type="tel"
      value={newDoctorPhone}
      onChange={(e) => setNewDoctorPhone(e.target.value)}
      placeholder="Enter phone number"
      required
    />

    <label>Email</label>
    <input
      type="email"
      value={newDoctorEmail}
      onChange={(e) => setNewDoctorEmail(e.target.value)}
      placeholder="Enter email address"
      required
    />

    <label>Consultation Fee (₹)</label>
    <input
      type="number"
      min="0"
      value={newConsultationFee}
      onChange={(e) => setNewConsultationFee(e.target.value)}
      placeholder="Enter fee"
      required
    />

    <button className="submit-btn" type="submit">
      + Register Doctor
    </button>

    {doctorMessage && <p className="form-message">{doctorMessage}</p>}
  </form>
</div>
  </section>
)}


            {/* APPOINTMENTS */}
            {activePage === 'Appointments' && (
              <section className="content-card">
                <div className="section-heading">
                  <div>
                    <h2>Appointment Management</h2>
                    <p>View all hospital appointments</p>
                  </div>

                  <span className="count-label">
                    {appointments.length} Appointments
                  </span>
                </div>

                <AppointmentTable
                  appointments={appointments}
                  formatDate={formatDate}
                  onCancel={handleCancel}
                  onComplete={handleComplete}
                />

                <div className="booking-form">
                  <h2>Book New Appointment</h2>
                  <p>
                    Schedule an appointment for a registered patient.
                  </p>

                  <form onSubmit={handleBooking}>
                    <label>Patient</label>
                    <select
                      value={patientId}
                      onChange={(e) => setPatientId(e.target.value)}
                      required
                    >
                      <option value="">Select a patient</option>

                      {patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.name} (ID: {patient.id})
                        </option>
                      ))}
                    </select>

                    <label>Doctor Name</label>
                    <input
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                      placeholder="Enter doctor name"
                      required
                    />

                    <label>Appointment Date and Time</label>
                    <input
                      type="datetime-local"
                      value={appointmentDateTime}
                      onChange={(e) =>
                        setAppointmentDateTime(e.target.value)
                      }
                      required
                    />

                    <label>Reason for Visit</label>
                    <input
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="e.g. General Checkup"
                      required
                    />

                    <button className="submit-btn" type="submit">
                      + Book Appointment
                    </button>
                  </form>
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  )
}

// APPOINTMENT TABLE COMPONENT

function AppointmentTable({
  appointments,
  formatDate,
  onCancel,
  onComplete
}: {
  appointments: Appointment[]
  formatDate: (date: string) => string
  onCancel: (id: number) => void
  onComplete: (id: number) => void
}) {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Date & Time</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>
                <strong>
                  {appointment.patient?.name ?? 'Unknown'}
                </strong>
                <span className="sub-text">
                  ID: #{appointment.patient?.id ?? '-'}
                </span>
              </td>

              <td>{appointment.doctorName}</td>

              <td>
                {formatDate(appointment.appointmentDateTime)}
              </td>

              <td>{appointment.reason}</td>

              <td>
                <span
                  className={`status-badge ${appointment.status.toLowerCase()}`}
                >
                  {appointment.status}
                </span>
              </td>

              <td>
                {appointment.status === 'SCHEDULED' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => onComplete(appointment.id)}
                    >
                      Complete
                    </button>

                    <button
                      type="button"
                      onClick={() => onCancel(appointment.id)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <span>No actions available</span>
                )}
              </td>
            </tr>
          ))}

          {appointments.length === 0 && (
            <tr>
              <td colSpan={6} className="empty-state">
                No appointments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default App
