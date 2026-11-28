
interface StatsCardsProps {
  totalPatients: number
  totalAppointments: number
  scheduledCount: number
  completedCount: number
  cancelledCount: number
  todayAppointments: number
  upcomingAppointments: number
}

function StatsCards({
  totalPatients,
  totalAppointments,
  scheduledCount,
  completedCount,
  cancelledCount,
  todayAppointments,
  upcomingAppointments
}: StatsCardsProps) {
  return (
    <section className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon blue">♙</div>
        <p>Total Patients</p>
        <h2>{totalPatients}</h2>
        <span>Registered patients</span>
      </div>

      <div className="stat-card">
        <div className="stat-icon purple">▣</div>
        <p>Total Appointments</p>
        <h2>{totalAppointments}</h2>
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

      <div className="stat-card">
        <div className="stat-icon blue">📅</div>
        <p>Today's Appointments</p>
        <h2>{todayAppointments}</h2>
        <span>Scheduled for today</span>
      </div>

      <div className="stat-card">
        <div className="stat-icon purple">⏳</div>
        <p>Upcoming Appointments</p>
        <h2>{upcomingAppointments}</h2>
        <span>Future scheduled appointments</span>
      </div>
    </section>
  )
}

export default StatsCards
