
import type { Appointment } from '../../types'
import AppointmentTable from '../appointments/AppointmentTable'

interface RecentAppointmentsProps {
  appointments: Appointment[]
  formatDate: (date: string) => string
  onCancel: (id: number) => void
  onComplete: (id: number) => void
  onReschedule: (id: number) => void
  onViewAll: () => void
}

function RecentAppointments({
  appointments,
  formatDate,
  onCancel,
  onComplete,
  onReschedule,
  onViewAll
}: RecentAppointmentsProps) {
  return (
    <section className="content-card">
      <div className="section-heading">
        <div>
          <h2>Recent Appointments</h2>
          <p>Latest appointments registered in the system</p>
        </div>

        <button className="text-btn" onClick={onViewAll}>
          View all →
        </button>
      </div>

      <AppointmentTable
        appointments={appointments.slice(0, 5)}
        formatDate={formatDate}
        onCancel={onCancel}
        onComplete={onComplete}
        onReschedule={onReschedule}
      />
    </section>
  )
}

export default RecentAppointments
