
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
  availableDays?: string
  morningStartTime?: string
  morningEndTime?: string
  eveningStartTime?: string
  eveningEndTime?: string
}


interface Appointment {
  id: number
  doctorName: string
  doctor?: Doctor
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
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState('All')
  const [selectedScheduleDate, setSelectedScheduleDate] = useState(
  new Date().toISOString().split('T')[0]
)
  const [editingDoctorId, setEditingDoctorId] = useState<number | null>(null)
const [editDoctorName, setEditDoctorName] = useState('')
const [editSpecialization, setEditSpecialization] = useState('')
const [editDoctorPhone, setEditDoctorPhone] = useState('')
const [editDoctorEmail, setEditDoctorEmail] = useState('')
const [editConsultationFee, setEditConsultationFee] = useState('')
const [editDoctorAvailableDays, setEditDoctorAvailableDays] = useState('')
const [editDoctorMorningStart, setEditDoctorMorningStart] = useState('10:00')
const [editDoctorMorningEnd, setEditDoctorMorningEnd] = useState('14:00')
const [editDoctorEveningStart, setEditDoctorEveningStart] = useState('17:00')
const [editDoctorEveningEnd, setEditDoctorEveningEnd] = useState('20:00')
  const [newDoctorName, setNewDoctorName] = useState('')
const [newSpecialization, setNewSpecialization] = useState('')
const [newDoctorPhone, setNewDoctorPhone] = useState('')
const [newDoctorEmail, setNewDoctorEmail] = useState('')
const [newConsultationFee, setNewConsultationFee] = useState('')
const [newDoctorAvailableDays, setNewDoctorAvailableDays] = useState('')
const [newDoctorMorningStart, setNewDoctorMorningStart] = useState('10:00')
const [newDoctorMorningEnd, setNewDoctorMorningEnd] = useState('14:00')
const [newDoctorEveningStart, setNewDoctorEveningStart] = useState('17:00')
const [newDoctorEveningEnd, setNewDoctorEveningEnd] = useState('20:00')
const [doctorMessage, setDoctorMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)

  const [selectedDoctorId, setSelectedDoctorId] = useState('')
  const [patientId, setPatientId] = useState('')
  const [appointmentDateTime, setAppointmentDateTime] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
const [availableSlots, setAvailableSlots] = useState<string[]>([])
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
  const [appointmentType, setAppointmentType] = useState('GENERAL')

useEffect(() => {
  if (!selectedDoctorId || !selectedDate || !appointmentType) {
    return
  }

  let cancelled = false

  const params = new URLSearchParams({
    doctorId: selectedDoctorId,
    date: selectedDate,
    appointmentType
  })

  fetch(`${API}/appointments/available-slots?${params.toString()}`)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error('Could not load available slots.')
      }
      return response.json() as Promise<string[]>
    })
    .then((slots) => {
      if (!cancelled) {
        setAvailableSlots(slots)
      }
    })
    .catch((error) => {
      if (!cancelled) {
        setAvailableSlots([])
        setMessage(
          error instanceof Error ? error.message : 'Failed to load slots.'
        )
      }
    })

  return () => {
    cancelled = true
  }
}, [selectedDoctorId, selectedDate, appointmentType])


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
        consultationFee: Number(newConsultationFee),
        availableDays: newDoctorAvailableDays,
        morningStartTime: newDoctorMorningStart,
        morningEndTime: newDoctorMorningEnd,
        eveningStartTime: newDoctorEveningStart,
        eveningEndTime: newDoctorEveningEnd
      })
    })

    if (!response.ok) {
      throw new Error('Could not register doctor.')
    }

    setDoctorMessage('Doctor registered successfully!')

    setNewDoctorName('')
    setNewSpecialization('')
    setNewDoctorPhone('')
    setNewDoctorEmail('')
    setNewConsultationFee('')
    setNewDoctorAvailableDays('')
    setNewDoctorMorningStart('10:00')
    setNewDoctorMorningEnd('14:00')
    setNewDoctorEveningStart('17:00')
    setNewDoctorEveningEnd('20:00')

    await loadData()

  } catch (err) {
    setDoctorMessage(
      err instanceof Error ? err.message : 'Registration failed.'
    )
  }
}


const handleEditDoctor = (doctor: Doctor) => {
  setEditingDoctorId(doctor.id)
  setEditDoctorName(doctor.name)
  setEditSpecialization(doctor.specialization)
  setEditDoctorPhone(doctor.phone)
  setEditDoctorEmail(doctor.email)
  setEditConsultationFee(String(doctor.consultationFee))

  setEditDoctorAvailableDays(doctor.availableDays || '')
  setEditDoctorMorningStart(doctor.morningStartTime || '10:00')
  setEditDoctorMorningEnd(doctor.morningEndTime || '14:00')
  setEditDoctorEveningStart(doctor.eveningStartTime || '17:00')
  setEditDoctorEveningEnd(doctor.eveningEndTime || '20:00')
}

const handleUpdateDoctor = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault()

  try {
    const response = await fetch(`${API}/doctors/${editingDoctorId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: editDoctorName,
specialization: editSpecialization,
phone: editDoctorPhone,
email: editDoctorEmail,
consultationFee: Number(editConsultationFee),
availableDays: editDoctorAvailableDays,
morningStartTime: editDoctorMorningStart,
morningEndTime: editDoctorMorningEnd,
eveningStartTime: editDoctorEveningStart,
eveningEndTime: editDoctorEveningEnd
      })
    })

    if (!response.ok) throw new Error('Could not update doctor.')

    setEditingDoctorId(null)
    await loadData()
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Update failed.')
  }
}

const handleDeleteDoctor = async (id: number) => {
  if (!window.confirm('Are you sure you want to delete this doctor?')) return

  try {
    const response = await fetch(`${API}/doctors/${id}`, {
      method: 'DELETE'
    })

    if (!response.ok) throw new Error('Could not delete doctor.')

    await loadData()
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Delete failed.')
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
      `${API}/appointments/${patientId}/${selectedDoctorId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          appointmentDateTime,
          reason,
          appointmentType,
          status: 'SCHEDULED'
        })
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        errorData.message || 'Could not book appointment.'
      )
    }

    setMessage('Appointment booked successfully!')

    setPatientId('')
    setAppointmentDateTime('')
    setReason('')
    setAppointmentType('GENERAL')

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

// Reschedule an appointment
const handleReschedule = async (id: number) => {
  try {
    setError('')
    setMessage('')

    const appointment = appointments.find(
      (item) => item.id === id
    )

    if (!appointment || !appointment.doctor?.id) {
      throw new Error('Appointment or doctor details not found.')
    }

    const newStart = window.prompt(
      'Enter new appointment date and time (YYYY-MM-DDTHH:mm):',
      appointment.appointmentDateTime.slice(0, 16)
    )

    if (!newStart) return

    const response = await fetch(
      `${API}/appointments/${id}/reschedule`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          doctorId: appointment.doctor.id,
          newStart: newStart
        })
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        errorData.message || 'Could not reschedule appointment.'
      )
    }

    setMessage('Appointment rescheduled successfully!')
    await loadData()
  } catch (err) {
    setError(
      err instanceof Error ? err.message : 'Rescheduling failed.'
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
  onReschedule={handleReschedule}
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
          <div className="card-actions">
  <button
    className="edit-btn"
    onClick={() => handleEditDoctor(doctor)}
  >
    Edit
  </button>

  <button
    className="delete-btn"
    onClick={() => handleDeleteDoctor(doctor.id)}
  >
    Delete
  </button>
</div>
{editingDoctorId === doctor.id && (
  <form onSubmit={handleUpdateDoctor} className="booking-form">
    <h3>Edit Doctor Details</h3>

    <label>Doctor Name</label>
    <input
      value={editDoctorName}
      onChange={(e) => setEditDoctorName(e.target.value)}
      required
    />

    <label>Specialization</label>
    <input
      value={editSpecialization}
      onChange={(e) => setEditSpecialization(e.target.value)}
      required
    />

    <label>Phone</label>
    <input
      value={editDoctorPhone}
      onChange={(e) => setEditDoctorPhone(e.target.value)}
      required
    />

    <label>Email</label>
    <input
      type="email"
      value={editDoctorEmail}
      onChange={(e) => setEditDoctorEmail(e.target.value)}
      required
    />

    <label>Consultation Fee (₹)</label>
    <input
      type="number"
      min="0"
      value={editConsultationFee}
      onChange={(e) => setEditConsultationFee(e.target.value)}
      required
    />

<label>Available Days</label>
<input
  value={editDoctorAvailableDays}
  onChange={(e) => setEditDoctorAvailableDays(e.target.value)}
  placeholder="e.g. Monday, Tuesday, Wednesday"
  required
/>

<label>Morning Shift Start</label>
<input
  type="time"
  value={editDoctorMorningStart}
  onChange={(e) => setEditDoctorMorningStart(e.target.value)}
  required
/>

<label>Morning Shift End</label>
<input
  type="time"
  value={editDoctorMorningEnd}
  onChange={(e) => setEditDoctorMorningEnd(e.target.value)}
  required
/>

<label>Evening Shift Start</label>
<input
  type="time"
  value={editDoctorEveningStart}
  onChange={(e) => setEditDoctorEveningStart(e.target.value)}
  required
/>

<label>Evening Shift End</label>
<input
  type="time"
  value={editDoctorEveningEnd}
  onChange={(e) => setEditDoctorEveningEnd(e.target.value)}
  required
/>

    <button type="submit" className="submit-btn">
      Save Changes
    </button>

    <button
      type="button"
      className="edit-btn"
      onClick={() => setEditingDoctorId(null)}
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

<label>Available Days</label>
<input
  value={newDoctorAvailableDays}
  onChange={(e) => setNewDoctorAvailableDays(e.target.value)}
  placeholder="e.g. Monday, Tuesday, Wednesday"
  required
/>


<label>Morning Shift Start</label>
<input
  type="time"
  value={newDoctorMorningStart}
  onChange={(e) => setNewDoctorMorningStart(e.target.value)}
  required
/>

<label>Morning Shift End</label>
<input
  type="time"
  value={newDoctorMorningEnd}
  onChange={(e) => setNewDoctorMorningEnd(e.target.value)}
  required
/>

<label>Evening Shift Start</label>
<input
  type="time"
  value={newDoctorEveningStart}
  onChange={(e) => setNewDoctorEveningStart(e.target.value)}
  required
/>

<label>Evening Shift End</label>
<input
  type="time"
  value={newDoctorEveningEnd}
  onChange={(e) => setNewDoctorEveningEnd(e.target.value)}
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
<div className="filter-container">
  <label>Filter by Doctor:</label>
  <select
    value={selectedDoctorFilter}
    onChange={(e) => setSelectedDoctorFilter(e.target.value)}
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
    onChange={(e) => setSelectedScheduleDate(e.target.value)}
  />
</div>
                  <span className="count-label">
                    {appointments.filter((appointment) => {
  const matchesDoctor =
    selectedDoctorFilter === 'All' ||
    appointment.doctorName ===
      doctors.find(
        (doctor) => String(doctor.id) === selectedDoctorFilter
      )?.name

  const matchesDate =
    appointment.appointmentDateTime?.slice(0, 10) ===
    selectedScheduleDate

  return matchesDoctor && matchesDate
}).length} Appointments
                  </span>
                </div>

                <AppointmentTable
                 appointments={appointments.filter((appointment) => {
  const matchesDoctor =
    selectedDoctorFilter === 'All' ||
    String(appointment.doctor?.id) === selectedDoctorFilter

  const matchesDate =
    appointment.appointmentDateTime?.slice(0, 10) ===
    selectedScheduleDate

  return matchesDoctor && matchesDate
})}
                  formatDate={formatDate}
                  onCancel={handleCancel}
                  onComplete={handleComplete}
                  onReschedule={handleReschedule}
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

                    <label>Doctor</label>
<select
  value={selectedDoctorId}
  onChange={(e) => setSelectedDoctorId(e.target.value)}
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
  onChange={(e) => {
    setSelectedDate(e.target.value)
    setAppointmentDateTime('')
  }}
  required
/>

<label>Available Time Slots</label>
<select
  value={appointmentDateTime}
  onChange={(e) => setAppointmentDateTime(e.target.value)}
  required
>
  <option value="">Select a time slot</option>
  {availableSlots.map((slot) => (
    <option key={slot} value={slot}>
      {new Date(slot).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })}
    </option>
  ))}
</select>


<label>Appointment Type</label>
<select
  value={appointmentType}
  onChange={(e) => setAppointmentType(e.target.value)}
  required
>
  <option value="NEW_PATIENT">New Patient (30 min)</option>
  <option value="FOLLOW_UP">Follow-up (15 min)</option>
  <option value="GENERAL">General Consultation (20 min)</option>
  <option value="COMPLEX">Complex Consultation (45 min)</option>
</select>

<p>
  Estimated Duration: {
    appointmentType === 'NEW_PATIENT' ? 30 :
    appointmentType === 'FOLLOW_UP' ? 15 :
    appointmentType === 'COMPLEX' ? 45 : 20
  } minutes
</p>

{selectedDate && availableSlots.length === 0 && (
  <p>No available slots for this date. Try another date.</p>
)}

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
  onComplete,
  onReschedule
}: {
  appointments: Appointment[]
  formatDate: (date: string) => string
  onCancel: (id: number) => void
  onComplete: (id: number) => void
  onReschedule: (id: number) => void
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
                      onClick={() => onReschedule(appointment.id)}
                    >
                      Reschedule
                    </button>

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
