
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts'

interface AppointmentChartData {
  name: string
  value: number
}

interface WeeklyAppointmentData {
  day: string
  appointments: number
}

interface AppointmentChartsProps {
  appointmentChartData: AppointmentChartData[]
  chartColors: string[]
  weeklyAppointmentData: WeeklyAppointmentData[]
}

function AppointmentCharts({
  appointmentChartData,
  chartColors,
  weeklyAppointmentData
}: AppointmentChartsProps) {
  return (
    <div className="dashboard-charts">
      <section className="content-card">
        <div className="section-heading">
          <div>
            <h2>Appointment Status Overview</h2>
            <p>Distribution of hospital appointments</p>
          </div>
        </div>

        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={appointmentChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={98}
                paddingAngle={4}
                label
              >
                {appointmentChartData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={chartColors[index]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="content-card">
        <div className="section-heading">
          <div>
            <h2>Weekly Appointment Activity</h2>
            <p>Appointments recorded throughout this week</p>
          </div>
        </div>

        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <BarChart data={weeklyAppointmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar
                dataKey="appointments"
                fill="#4F46E5"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  )
}

export default AppointmentCharts
