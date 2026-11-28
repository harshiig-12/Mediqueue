import { useEffect, useState, type FormEvent } from 'react'
import './App.css'

import type { Patient, Doctor, Appointment, Billing, MedicalTestReport } from './types'
import { API, fetchDashboardData } from './services/api'

import AuthForm from './components/auth/AuthForm'
import Sidebar from './components/layout/Sidebar'
import Navbar from './components/layout/Navbar'
import DashboardPage from './components/dashboard/DashboardPage'
import PatientDirectory from './components/patients/PatientDirectory'
import PatientEditForm from './components/patients/PatientEditForm'
import PatientRegistrationForm from './components/patients/PatientRegistrationForm'
import DoctorManagement from './components/doctors/DoctorManagement'
import AppointmentManagement from './components/appointments/AppointmentManagement'
import BillingManagement from './components/billing/BillingManagement'
import MedicalTestReports from './components/reports/MedicalTestReports'

function App() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [bills, setBills] = useState<Billing[]>([])

const [billingPatientId, setBillingPatientId] = useState('')
const [billingAppointmentId, setBillingAppointmentId] = useState('')
const [additionalCharges, setAdditionalCharges] = useState('0')
const [discount, setDiscount] = useState('0')
const [billingMessage, setBillingMessage] = useState('')
const [billingLoading, setBillingLoading] = useState(false)
const [paymentAmounts, setPaymentAmounts] = useState<Record<number, string>>({})
const [paymentMessage, setPaymentMessage] = useState('')
const [reports, setReports] = useState<MedicalTestReport[]>([])
const [reportPatientId, setReportPatientId] = useState('')
const [reportTestName, setReportTestName] = useState('')
const [reportTestDate, setReportTestDate] = useState('')
const [reportResult, setReportResult] = useState('')
const [reportNotes, setReportNotes] = useState('')
const [reportMessage, setReportMessage] = useState('')
const [reportLoading, setReportLoading] = useState(false)
const [editingReportId, setEditingReportId] = useState<number | null>(null)
const [reportSearch, setReportSearch] = useState('')
const [reportFilterPatientId, setReportFilterPatientId] = useState('')
const [editTestName, setEditTestName] = useState('')
const [editTestDate, setEditTestDate] = useState('')
const [editResult, setEditResult] = useState('')
const [editNotes, setEditNotes] = useState('')

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
  const [token, setToken] = useState<string | null>(
  localStorage.getItem('token')
)
const [userName, setUserName] = useState(
  localStorage.getItem('userName') || ''
)
const [userRole, setUserRole] = useState(
  localStorage.getItem('userRole') || ''
)
const [authPage, setAuthPage] = useState<'login' | 'register'>('login')
const [authEmail, setAuthEmail] = useState('')
const [authPassword, setAuthPassword] = useState('')
const [authName, setAuthName] = useState('')
const [authMessage, setAuthMessage] = useState('')





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
  if (!token) return;
  if (!token || !selectedDoctorId || !selectedDate || !appointmentType) {
    return
  }

  let cancelled = false

  const params = new URLSearchParams({
    doctorId: selectedDoctorId,
    date: selectedDate,
    appointmentType
  })

  fetch(`${API}/appointments/available-slots?${params.toString()}`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
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
}, [token, selectedDoctorId, selectedDate, appointmentType])


  useEffect(() => {
    if (!token) return;
    let cancelled = false

    fetchDashboardData(token!)
      .then((data) => {
        if (!cancelled) {
          setPatients(data.patients)
          setAppointments(data.appointments)
          setDoctors(data.doctors)
          setBills(data.bills)
          setReports(data.reports)
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
  }, [token])

  const loadData = async () => {
    try {
      setError('')
      const data = await fetchDashboardData(token!)

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
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`
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
      headers: {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`
},
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
      headers: {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`
},
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

    
if (!response.ok) {
  const errorText = await response.text()

  let errorMessage = errorText || `Delete failed (HTTP ${response.status})`

  try {
    const errorData = JSON.parse(errorText)
    errorMessage = errorData.message || errorData.error || errorMessage
  } catch {
    // Keep the original error text
  }

  throw new Error(errorMessage)
}


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
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`
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
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
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
  method: 'PUT',
  headers: {
    Authorization: `Bearer ${token}`
  }
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
          method: 'PUT',
          headers: {
    Authorization: `Bearer ${token}`
  }
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
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
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
          method: 'DELETE',
          headers: {
    Authorization: `Bearer ${token}`
  }
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

  const appointmentChartData = [
  { name: 'Scheduled', value: scheduledCount },
  { name: 'Completed', value: completedCount },
  { name: 'Cancelled', value: cancelledCount }
]

const chartColors = ['#4F46E5', '#10B981', '#F43F5E']

const weeklyAppointmentData = (() => {
  const today = new Date()
  const startOfWeek = new Date(today)
  const day = today.getDay()

  startOfWeek.setDate(today.getDate() - day)
  startOfWeek.setHours(0, 0, 0, 0)

  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
    (dayName, index) => {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + index)

      const count = appointments.filter((appointment) => {
        const appointmentDate = new Date(
          appointment.appointmentDateTime
        )

        return appointmentDate.toDateString() === date.toDateString()
      }).length

      return { day: dayName, appointments: count }
    }
  )
})()

  const todayAppointments = appointments.filter((appointment) => {
  const appointmentDate = new Date(appointment.appointmentDateTime)
  const today = new Date()

  return (
    appointment.status === 'SCHEDULED' &&
    appointmentDate.getDate() === today.getDate() &&
    appointmentDate.getMonth() === today.getMonth() &&
    appointmentDate.getFullYear() === today.getFullYear()
  )
}).length

const upcomingAppointments = appointments.filter((appointment) => {
  return (
    appointment.status === 'SCHEDULED' &&
    new Date(appointment.appointmentDateTime) > new Date()
  )
}).length

  
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setAuthMessage('');

  try {
    const response = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: authEmail,
        password: authPassword
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Invalid email or password');
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('userName', data.name);
    localStorage.setItem('userRole', data.role);

    setToken(data.token);
    setUserName(data.name);
    setUserRole(data.role);
    setAuthPassword('');
  } catch (error) {
    setAuthMessage(
      error instanceof Error ? error.message : 'Login failed'
    );
  }
};

const handleGenerateBill = async (e: React.FormEvent) => {
  e.preventDefault()
  setBillingMessage('')

  if (!billingPatientId) {
    setBillingMessage('Please select a patient.')
    return
  }

  const extra = Number(additionalCharges)
  const discountValue = Number(discount)

  if (
    !Number.isFinite(extra) ||
    !Number.isFinite(discountValue) ||
    extra < 0 ||
    discountValue < 0
  ) {
    setBillingMessage('Charges and discount must be valid non-negative amounts.')
    return
  }

  setBillingLoading(true)

  try {
    const response = await fetch(`${API}/billing`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        patientId: Number(billingPatientId),
        appointmentId: billingAppointmentId
          ? Number(billingAppointmentId)
          : null,
        additionalCharges: extra,
        discount: discountValue
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Unable to generate bill.')
    }

    setBillingMessage('Bill generated successfully!')
    setBillingPatientId('')
    setBillingAppointmentId('')
    setAdditionalCharges('0')
    setDiscount('0')

    const updatedBills = await fetch(`${API}/billing`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (!updatedBills.ok) {
      throw new Error('Bill created, but the billing list could not refresh.')
    }

    setBills(await updatedBills.json())
  } catch (error) {
    setBillingMessage(
      error instanceof Error ? error.message : 'Bill generation failed.'
    )
  } finally {
    setBillingLoading(false)
  }
}


const handleCreateReport = async (e: React.FormEvent) => {
  e.preventDefault()
  setReportMessage('')

  if (!reportPatientId || !reportTestName.trim() || !reportTestDate || !reportResult.trim()) {
    setReportMessage('Please fill in all required fields.')
    return
  }

  setReportLoading(true)

  try {
    const response = await fetch(
      `${API}/test-reports?patientId=${Number(reportPatientId)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          testName: reportTestName.trim(),
          testDate: reportTestDate,
          result: reportResult.trim(),
          notes: reportNotes.trim()
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Unable to create report.')
    }

    setReportMessage('Medical test report created successfully!')
    setReportPatientId('')
    setReportTestName('')
    setReportTestDate('')
    setReportResult('')
    setReportNotes('')

    const updatedReports = await fetch(`${API}/test-reports`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (!updatedReports.ok) {
      throw new Error('Report created, but the report list could not refresh.')
    }

    setReports(await updatedReports.json())

  } catch (error) {
    setReportMessage(
      error instanceof Error ? error.message : 'Report creation failed.'
    )
  } finally {
    setReportLoading(false)
  }
}
const handleUpdateReport = async (e: React.FormEvent) => {
  e.preventDefault()

  if (editingReportId === null) return

  try {
    const response = await fetch(
      `${API}/test-reports/${editingReportId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          testName: editTestName,
          testDate: editTestDate,
          result: editResult,
          notes: editNotes
        })
      }
    )

    if (!response.ok) throw new Error('Unable to update report.')

    const updatedReports = await fetch(`${API}/test-reports`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (!updatedReports.ok) throw new Error('Unable to refresh reports.')

    setReports(await updatedReports.json())
    setEditingReportId(null)
    setReportMessage('Report updated successfully!')
  } catch (error) {
    setReportMessage(
      error instanceof Error ? error.message : 'Update failed.'
    )
  }
}
const handleDeleteReport = async (id: number) => {
  if (!window.confirm('Are you sure you want to delete this report?')) {
    return
  }

  try {
    const response = await fetch(`${API}/test-reports/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) throw new Error('Unable to delete report.')

    setReports(previous => previous.filter(report => report.id !== id))
    setReportMessage('Report deleted successfully!')
  } catch (error) {
    setReportMessage(
      error instanceof Error ? error.message : 'Delete failed.'
    )
  }
}

const handlePrintReport = (report: MedicalTestReport) => {
  const printWindow = window.open('', '_blank', 'width=800,height=900')

  if (!printWindow) {
    alert('Please allow pop-ups to print the report.')
    return
  }

  const escapeHtml = (value: string) =>
    value.replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    })[char]!)

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Medical Test Report #${report.id}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            color: #222;
          }
          .header {
            border-bottom: 2px solid #2563eb;
            padding-bottom: 20px;
          }
          h1 { color: #2563eb; }
          .details {
            margin-top: 30px;
            line-height: 2;
          }
          .result {
            margin-top: 25px;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
          }
          .footer {
            margin-top: 50px;
            text-align: center;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>MediQueue</h1>
          <h2>Medical Test Report</h2>
          <p>Report ID: ${report.id}</p>
        </div>

        <div class="details">
          <strong>Patient:</strong> ${escapeHtml(report.patient?.name || 'N/A')}<br />
          <strong>Test Name:</strong> ${escapeHtml(report.testName)}<br />
          <strong>Test Date:</strong> ${escapeHtml(report.testDate)}
        </div>

        <div class="result">
          <h3>Test Result</h3>
          <p>${escapeHtml(report.result).replace(/\n/g, '<br />')}</p>

          ${report.notes
            ? `<h3>Additional Notes</h3><p>${escapeHtml(report.notes).replace(/\n/g, '<br />')}</p>`
            : ''}
        </div>

        <div class="footer">
          <p>Generated through MediQueue</p>
          <p>This report reflects the information entered into the system.</p>
        </div>

        <script>
          window.onload = () => window.print()
        </script>
      </body>
    </html>
  `)

  printWindow.document.close()
}


const handleRecordPayment = async (billId: number) => {
  setPaymentMessage('')

  const amount = Number(paymentAmounts[billId])

  if (!Number.isFinite(amount) || amount <= 0) {
    setPaymentMessage('Enter a valid payment amount.')
    return
  }

  try {
    const response = await fetch(`${API}/billing/${billId}/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ amount })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Payment failed.')
    }

    setPaymentMessage('Payment recorded successfully!')

    setPaymentAmounts((previous) => ({
      ...previous,
      [billId]: ''
    }))

    const updatedBills = await fetch(`${API}/billing`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (!updatedBills.ok) {
      throw new Error('Payment recorded, but bills could not refresh.')
    }

    setBills(await updatedBills.json())
  } catch (error) {
    setPaymentMessage(
      error instanceof Error ? error.message : 'Payment failed.'
    )
  }
}


const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  setAuthMessage('');

  try {
    const response = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: authName,
        email: authEmail,
        password: authPassword
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    setAuthMessage('Registration successful! Please log in.');
    setAuthPage('login');
    setAuthName('');
    setAuthPassword('');
  } catch (error) {
    setAuthMessage(
      error instanceof Error ? error.message : 'Registration failed'
    );
  }
};
const handlePrintInvoice = (bill: Billing) => {
  const printWindow = window.open('', '_blank', 'width=800,height=900')

  if (!printWindow) {
    alert('Please allow pop-ups to print the invoice.')
    return
  }

  const escapeHtml = (value: string) =>
    value.replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    })[char]!)

  const balance = Number(bill.totalAmount) - Number(bill.amountPaid)

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Invoice ${escapeHtml(bill.billNumber)}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            color: #222;
          }
          .header {
            display: flex;
            justify-content: space-between;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 20px;
          }
          h1 { color: #2563eb; margin-bottom: 5px; }
          .details { margin-top: 30px; line-height: 1.8; }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 30px;
          }
          th, td {
            padding: 14px;
            border-bottom: 1px solid #ddd;
            text-align: left;
          }
          .total { font-weight: bold; font-size: 18px; }
          .footer {
            margin-top: 50px;
            text-align: center;
            color: #666;
          }
          @media print {
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1>MediQueue</h1>
            <p>Patient Billing Invoice</p>
          </div>
          <div>
            <strong>Invoice:</strong> ${escapeHtml(bill.billNumber)}<br />
            <strong>Date:</strong> ${escapeHtml(formatDate(bill.billDate))}
          </div>
        </div>

        <div class="details">
          <strong>Patient:</strong> ${escapeHtml(bill.patient?.name || 'N/A')}<br />
          <strong>Doctor:</strong> ${escapeHtml(bill.doctorName || 'N/A')}<br />
          <strong>Payment Status:</strong> ${escapeHtml(bill.paymentStatus)}
        </div>

        <table>
          <tr><th>Description</th><th>Amount</th></tr>
          <tr><td>Consultation Fee</td><td>₹${Number(bill.consultationFee).toFixed(2)}</td></tr>
          <tr><td>Additional Charges</td><td>₹${Number(bill.additionalCharges).toFixed(2)}</td></tr>
          <tr><td>Discount</td><td>- ₹${Number(bill.discount).toFixed(2)}</td></tr>
          <tr class="total"><td>Total Amount</td><td>₹${Number(bill.totalAmount).toFixed(2)}</td></tr>
          <tr><td>Amount Paid</td><td>₹${Number(bill.amountPaid).toFixed(2)}</td></tr>
          <tr class="total"><td>Balance Due</td><td>₹${balance.toFixed(2)}</td></tr>
        </table>

        <div class="footer">
          <p>Thank you for choosing MediQueue!</p>
        </div>
        <script>
          window.onload = () => window.print()
        </script>
      </body>
    </html>
  `)

  printWindow.document.close()
}

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
  localStorage.removeItem('userRole');

  setToken(null);
  setUserName('');
  setUserRole('');
  setAuthEmail('');
  setAuthPassword('');
};


if (!token) {
  return (
    <AuthForm
      authPage={authPage}
      authName={authName}
      authEmail={authEmail}
      authPassword={authPassword}
      authMessage={authMessage}
      setAuthName={setAuthName}
      setAuthEmail={setAuthEmail}
      setAuthPassword={setAuthPassword}
      onLogin={handleLogin}
      onRegister={handleRegister}
      onTogglePage={() => {
        setAuthPage(authPage === 'login' ? 'register' : 'login')
        setAuthMessage('')
      }}
    />
  )
}

  return (
    <div className="app-layout">
      <Sidebar
        activePage={activePage}
        userRole={userRole}
        userName={userName}
        onNavigate={(page) => {
          setActivePage(page)
          setMessage('')
          setError('')
        }}
        onLogout={handleLogout}
      />

      <main className="main-content">
        <Navbar activePage={activePage} onRefresh={loadData} />

        {error && <div className="error-message">{error}</div>}

        {message && <p className="form-message">{message}</p>}

        {loading ? (
          <p className="loading">Loading MediQueue data...</p>
        ) : (
          <>
            {activePage === 'Dashboard' && (
              <DashboardPage
                totalPatients={patients.length}
                totalAppointments={appointments.length}
                scheduledCount={scheduledCount}
                completedCount={completedCount}
                cancelledCount={cancelledCount}
                todayAppointments={todayAppointments}
                upcomingAppointments={upcomingAppointments}
                appointmentChartData={appointmentChartData}
                chartColors={chartColors}
                weeklyAppointmentData={weeklyAppointmentData}
                appointments={appointments}
                formatDate={formatDate}
                onCancel={handleCancel}
                onComplete={handleComplete}
                onReschedule={handleReschedule}
                onViewAll={() => setActivePage('Appointments')}
              />
            )}

            {activePage === 'Patients' && (
              <PatientDirectory
                patients={patients}
                searchTerm={searchTerm}
                userRole={userRole}
                onSearchChange={setSearchTerm}
                onEdit={setEditingPatient}
                onDelete={handlePatientDelete}
                paymentMessage={paymentMessage}
              />
            )}

            {editingPatient && (
              <PatientEditForm
                patient={editingPatient}
                onChange={setEditingPatient}
                onSave={handlePatientUpdate}
                onCancel={() => setEditingPatient(null)}
              />
            )}

            {activePage === 'Register Patient' && (
              <PatientRegistrationForm
                newName={newName}
                newAge={newAge}
                newGender={newGender}
                newPhone={newPhone}
                newEmail={newEmail}
                newDateOfBirth={newDateOfBirth}
                registrationMessage={registrationMessage}
                onNameChange={setNewName}
                onAgeChange={setNewAge}
                onGenderChange={setNewGender}
                onPhoneChange={setNewPhone}
                onEmailChange={setNewEmail}
                onDateOfBirthChange={setNewDateOfBirth}
                onSubmit={handlePatientRegistration}
              />
            )}

{activePage === 'Doctors' && userRole === 'ADMIN' && (
              <DoctorManagement
                doctors={doctors}
                editingDoctorId={editingDoctorId}
                editDoctor={{
                  name: editDoctorName,
                  specialization: editSpecialization,
                  phone: editDoctorPhone,
                  email: editDoctorEmail,
                  consultationFee: editConsultationFee,
                  availableDays: editDoctorAvailableDays,
                  morningStart: editDoctorMorningStart,
                  morningEnd: editDoctorMorningEnd,
                  eveningStart: editDoctorEveningStart,
                  eveningEnd: editDoctorEveningEnd
                }}
                newDoctor={{
                  name: newDoctorName,
                  specialization: newSpecialization,
                  phone: newDoctorPhone,
                  email: newDoctorEmail,
                  consultationFee: newConsultationFee,
                  availableDays: newDoctorAvailableDays,
                  morningStart: newDoctorMorningStart,
                  morningEnd: newDoctorMorningEnd,
                  eveningStart: newDoctorEveningStart,
                  eveningEnd: newDoctorEveningEnd
                }}
                doctorMessage={doctorMessage}
                onEditChange={(field, value) => {
                  const setters = {
                    name: setEditDoctorName,
                    specialization: setEditSpecialization,
                    phone: setEditDoctorPhone,
                    email: setEditDoctorEmail,
                    consultationFee: setEditConsultationFee,
                    availableDays: setEditDoctorAvailableDays,
                    morningStart: setEditDoctorMorningStart,
                    morningEnd: setEditDoctorMorningEnd,
                    eveningStart: setEditDoctorEveningStart,
                    eveningEnd: setEditDoctorEveningEnd
                  }
                  setters[field](value)
                }}
                onNewChange={(field, value) => {
                  const setters = {
                    name: setNewDoctorName,
                    specialization: setNewSpecialization,
                    phone: setNewDoctorPhone,
                    email: setNewDoctorEmail,
                    consultationFee: setNewConsultationFee,
                    availableDays: setNewDoctorAvailableDays,
                    morningStart: setNewDoctorMorningStart,
                    morningEnd: setNewDoctorMorningEnd,
                    eveningStart: setNewDoctorEveningStart,
                    eveningEnd: setNewDoctorEveningEnd
                  }
                  setters[field](value)
                }}
                onEditDoctor={handleEditDoctor}
                onDeleteDoctor={handleDeleteDoctor}
                onUpdateDoctor={handleUpdateDoctor}
                onRegisterDoctor={handleDoctorRegistration}
                onCancelEdit={() => setEditingDoctorId(null)}
              />
            )}

            {activePage === 'Appointments' && (
              <AppointmentManagement
                appointments={appointments}
                patients={patients}
                doctors={doctors}
                selectedDoctorFilter={selectedDoctorFilter}
                selectedScheduleDate={selectedScheduleDate}
                patientId={patientId}
                selectedDoctorId={selectedDoctorId}
                selectedDate={selectedDate}
                appointmentDateTime={appointmentDateTime}
                availableSlots={availableSlots}
                appointmentType={appointmentType}
                reason={reason}
                formatDate={formatDate}
                onDoctorFilterChange={setSelectedDoctorFilter}
                onScheduleDateChange={setSelectedScheduleDate}
                onPatientChange={setPatientId}
                onDoctorChange={setSelectedDoctorId}
                onDateChange={(value) => {
                  setSelectedDate(value)
                  setAppointmentDateTime('')
                }}
                onTimeChange={setAppointmentDateTime}
                onAppointmentTypeChange={setAppointmentType}
                onReasonChange={setReason}
                onBooking={handleBooking}
                onCancel={handleCancel}
                onComplete={handleComplete}
                onReschedule={handleReschedule}
              />
            )}

{activePage === 'Billing' && (
              <BillingManagement
                bills={bills}
                patients={patients}
                appointments={appointments}
                userRole={userRole}
                billingPatientId={billingPatientId}
                billingAppointmentId={billingAppointmentId}
                additionalCharges={additionalCharges}
                discount={discount}
                billingMessage={billingMessage}
                billingLoading={billingLoading}
                paymentAmounts={paymentAmounts}
                paymentMessage={paymentMessage}
                formatDate={formatDate}
                onPatientChange={(value) => {
                  setBillingPatientId(value)
                  setBillingAppointmentId('')
                }}
                onAppointmentChange={setBillingAppointmentId}
                onChargesChange={setAdditionalCharges}
                onDiscountChange={setDiscount}
                onPaymentAmountChange={(billId, value) =>
                  setPaymentAmounts((previous) => ({
                    ...previous,
                    [billId]: value
                  }))
                }
                onGenerateBill={handleGenerateBill}
                onRecordPayment={handleRecordPayment}
                onPrintInvoice={handlePrintInvoice}
              />
            )}

{activePage === 'Medical Test Reports' && (
              <MedicalTestReports
                reports={reports}
                patients={patients}
                userRole={userRole}
                reportPatientId={reportPatientId}
                reportTestName={reportTestName}
                reportTestDate={reportTestDate}
                reportResult={reportResult}
                reportNotes={reportNotes}
                reportMessage={reportMessage}
                reportLoading={reportLoading}
                reportSearch={reportSearch}
                reportFilterPatientId={reportFilterPatientId}
                editingReportId={editingReportId}
                editReport={{
                  testName: editTestName,
                  testDate: editTestDate,
                  result: editResult,
                  notes: editNotes
                }}
                onCreateChange={(field, value) => {
                  const setters = {
                    testName: setReportTestName,
                    testDate: setReportTestDate,
                    result: setReportResult,
                    notes: setReportNotes
                  }
                  setters[field](value)
                }}
                onEditChange={(field, value) => {
                  const setters = {
                    testName: setEditTestName,
                    testDate: setEditTestDate,
                    result: setEditResult,
                    notes: setEditNotes
                  }
                  setters[field](value)
                }}
                onPatientChange={setReportPatientId}
                onSearchChange={setReportSearch}
                onFilterChange={setReportFilterPatientId}
                onCreate={handleCreateReport}
                onUpdate={handleUpdateReport}
                onStartEdit={(report) => {
                  setEditingReportId(report.id)
                  setEditTestName(report.testName)
                  setEditTestDate(report.testDate)
                  setEditResult(report.result)
                  setEditNotes(report.notes || '')
                }}
                onCancelEdit={() => setEditingReportId(null)}
                onDelete={handleDeleteReport}
                onPrint={handlePrintReport}
              />
            )}

          </>
        )}
      </main>
    </div>
  )
}

export default App
