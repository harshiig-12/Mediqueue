import type { Appointment } from '../../types'

import StatsCards from './StatsCards'
import AppointmentCharts from './AppointmentCharts'
import RecentAppointments from './RecentAppointments'

interface DashboardPageProps {
  totalPatients: number
  totalAppointments: number
  scheduledCount: number
  completedCount: number
  cancelledCount: number
  todayAppointments: number
  upcomingAppointments: number

  appointmentChartData: {
    name: string
    value: number
  }[]

  chartColors: string[]

  weeklyAppointmentData: {
    day: string
    appointments: number
  }[]

  appointments: Appointment[]

  formatDate: (date: string) => string
  onCancel: (id: number) => void
  onComplete: (id: number) => void
  onReschedule: (id: number) => void
  onViewAll: () => void
}

function DashboardPage({
  totalPatients,
  totalAppointments,
  scheduledCount,
  completedCount,
  cancelledCount,
  todayAppointments,
  upcomingAppointments,
  appointmentChartData,
  chartColors,
  weeklyAppointmentData,
  appointments,
  formatDate,
  onCancel,
  onComplete,
  onReschedule,
  onViewAll
}: DashboardPageProps) {
  return (
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

      <StatsCards
        totalPatients={totalPatients}
        totalAppointments={totalAppointments}
        scheduledCount={scheduledCount}
        completedCount={completedCount}
        cancelledCount={cancelledCount}
        todayAppointments={todayAppointments}
        upcomingAppointments={upcomingAppointments}
      />

      <AppointmentCharts
        appointmentChartData={appointmentChartData}
        chartColors={chartColors}
        weeklyAppointmentData={weeklyAppointmentData}
      />

      <RecentAppointments
        appointments={appointments}
        formatDate={formatDate}
        onCancel={onCancel}
        onComplete={onComplete}
        onReschedule={onReschedule}
        onViewAll={onViewAll}
      />
    </>
  )
}

export default DashboardPage