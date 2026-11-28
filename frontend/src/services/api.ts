
import type {
  Patient,
  Doctor,
  Appointment,
  Billing,
  MedicalTestReport
} from '../types'

export const API =
  import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api'

export async function fetchDashboardData(token: string) {
  const [
    patientResponse,
    appointmentResponse,
    doctorResponse,
    billingResponse,
    reportResponse
  ] = await Promise.all([
    fetch(`${API}/patients`, {
      headers: { Authorization: `Bearer ${token}` }
    }),
    fetch(`${API}/appointments`, {
      headers: { Authorization: `Bearer ${token}` }
    }),
    fetch(`${API}/doctors`, {
      headers: { Authorization: `Bearer ${token}` }
    }),
    fetch(`${API}/billing`, {
      headers: { Authorization: `Bearer ${token}` }
    }),
    fetch(`${API}/test-reports`, {
      headers: { Authorization: `Bearer ${token}` }
    })
  ])

  if (
    !patientResponse.ok ||
    !appointmentResponse.ok ||
    !doctorResponse.ok ||
    !billingResponse.ok ||
    !reportResponse.ok
  ) {
    throw new Error('Unable to load data from the server.')
  }

  const patients: Patient[] = await patientResponse.json()
  const appointments: Appointment[] = await appointmentResponse.json()
  const doctors: Doctor[] = await doctorResponse.json()
  const bills: Billing[] = await billingResponse.json()
  const reports: MedicalTestReport[] = await reportResponse.json()

  return { patients, appointments, doctors, bills, reports }
}

