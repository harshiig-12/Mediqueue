
export interface Patient {
  id: number
  name: string
  age: number
  gender: string
  phone: string
  email: string
  dateOfBirth?: string
}

export interface Doctor {
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

export interface Appointment {
  id: number
  doctorName: string
  doctor?: Doctor
  appointmentDateTime: string
  reason: string
  status: string
  patient: Patient
  appointmentType?: string
  estimatedDurationMinutes?: number | null
}

export interface Billing {
  id: number
  billNumber: string
  billDate: string
  patient: Patient
  appointment?: Appointment | null
  doctorName: string
  consultationFee: number
  additionalCharges: number
  discount: number
  totalAmount: number
  amountPaid: number
  paymentStatus: string
}

export interface MedicalTestReport {
  id: number
  testName: string
  testDate: string
  result: string
  notes: string
  patient: Patient
}
