
import type { Appointment } from '../../types'

interface AppointmentTableProps {
  appointments: Appointment[]
  formatDate: (date: string) => string
  onCancel: (id: number) => void
  onComplete: (id: number) => void
  onReschedule: (id: number) => void
}

function AppointmentTable({
  appointments,
  formatDate,
  onCancel,
  onComplete,
  onReschedule
}: AppointmentTableProps) {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Date & Time</th>
            <th>Appointment Type</th>
            <th>Duration</th>
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

              <td>{formatDate(appointment.appointmentDateTime)}</td>

              <td>
                {appointment.appointmentType
                  ? appointment.appointmentType.replaceAll('_', ' ')
                  : '-'}
              </td>

              <td>
                {appointment.estimatedDurationMinutes != null
                  ? `${appointment.estimatedDurationMinutes} min`
                  : '-'}
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
              <td colSpan={8} className="empty-state">
                No appointments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default AppointmentTable
