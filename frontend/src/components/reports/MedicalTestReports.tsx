import type { Patient, MedicalTestReport } from '../../types'

interface ReportFormData {
  testName: string
  testDate: string
  result: string
  notes: string
}

interface MedicalTestReportsProps {
  reports: MedicalTestReport[]
  patients: Patient[]
  userRole: string
  reportPatientId: string
  reportTestName: string
  reportTestDate: string
  reportResult: string
  reportNotes: string
  reportMessage: string
  reportLoading: boolean
  reportSearch: string
  reportFilterPatientId: string
  editingReportId: number | null
  editReport: ReportFormData
  onCreateChange: (field: keyof ReportFormData, value: string) => void
  onEditChange: (field: keyof ReportFormData, value: string) => void
  onPatientChange: (value: string) => void
  onSearchChange: (value: string) => void
  onFilterChange: (value: string) => void
  onCreate: (event: React.FormEvent<HTMLFormElement>) => void
  onUpdate: (event: React.FormEvent<HTMLFormElement>) => void
  onStartEdit: (report: MedicalTestReport) => void
  onCancelEdit: () => void
  onDelete: (id: number) => void
  onPrint: (report: MedicalTestReport) => void
}

export default function MedicalTestReports({
  reports,
  patients,
  userRole,
  reportPatientId,
  reportTestName,
  reportTestDate,
  reportResult,
  reportNotes,
  reportMessage,
  reportLoading,
  reportSearch,
  reportFilterPatientId,
  editingReportId,
  editReport,
  onCreateChange,
  onEditChange,
  onPatientChange,
  onSearchChange,
  onFilterChange,
  onCreate,
  onUpdate,
  onStartEdit,
  onCancelEdit,
  onDelete,
  onPrint,
}: MedicalTestReportsProps) {
  const filteredReports = reports.filter((report) => {
    const search = reportSearch.toLowerCase()

    const matchesSearch =
      report.testName.toLowerCase().includes(search) ||
      report.patient?.name?.toLowerCase().includes(search)

    const matchesPatient =
      !reportFilterPatientId ||
      String(report.patient?.id) === reportFilterPatientId

    return matchesSearch && matchesPatient
  })

  return (
    <section className="content-card">
      <div className="section-heading">
        <div>
          <h2>Medical Test Reports</h2>
          <p>Manage and view patient medical test records</p>
        </div>

        <span className="count-label">
          {reports.length} Reports
        </span>
      </div>

      {userRole === 'ADMIN' && (
        <div className="booking-form">
          <h2>Add New Test Report</h2>
          <p>Create a medical test report for a registered patient.</p>

          <form onSubmit={onCreate}>
            <label>Patient</label>
            <select
              value={reportPatientId}
              onChange={(e) => onPatientChange(e.target.value)}
              required
            >
              <option value="">Select a patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} (ID: {patient.id})
                </option>
              ))}
            </select>

            <label>Test Name</label>
            <input
              type="text"
              placeholder="e.g. Complete Blood Count"
              value={reportTestName}
              onChange={(e) => onCreateChange('testName', e.target.value)}
              required
            />

            <label>Test Date</label>
            <input
              type="date"
              value={reportTestDate}
              onChange={(e) => onCreateChange('testDate', e.target.value)}
              required
            />

            <label>Test Result</label>
            <textarea
              placeholder="Enter test results"
              value={reportResult}
              onChange={(e) => onCreateChange('result', e.target.value)}
              required
            />

            <label>Additional Notes</label>
            <textarea
              placeholder="Optional observations or notes"
              value={reportNotes}
              onChange={(e) => onCreateChange('notes', e.target.value)}
            />

            <button
              className="submit-btn"
              type="submit"
              disabled={reportLoading}
            >
              {reportLoading ? 'Saving...' : '+ Add Test Report'}
            </button>
          </form>

          {reportMessage && (
            <p className="form-message">{reportMessage}</p>
          )}
        </div>
      )}

      <div className="booking-form">
        <h3>Search & Filter Reports</h3>

        <label>Search by patient or test name</label>
        <input
          type="text"
          placeholder="Enter patient name or test name..."
          value={reportSearch}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        <label>Filter by Patient</label>
        <select
          value={reportFilterPatientId}
          onChange={(e) => onFilterChange(e.target.value)}
        >
          <option value="">All Patients</option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.name}
            </option>
          ))}
        </select>
      </div>

      <div className="patient-grid">
        {filteredReports.map((report) => (
          <div className="patient-card" key={report.id}>
            <h3>{report.testName}</h3>

            <p>Patient: {report.patient?.name}</p>
            <p>Report ID: {report.id}</p>
            <p>Test Date: {report.testDate}</p>

            <p>
              <strong>Result:</strong> {report.result}
            </p>

            {report.notes && (
              <p>
                <strong>Notes:</strong> {report.notes}
              </p>
            )}

            <button
              className="submit-btn"
              type="button"
              onClick={() => onPrint(report)}
            >
              🖨 Print Report
            </button>

            {userRole === 'ADMIN' && (
              <div className="action-buttons">
                <button
                  className="submit-btn"
                  type="button"
                  onClick={() => onStartEdit(report)}
                >
                  Edit Report
                </button>

                <button
                  className="submit-btn"
                  type="button"
                  onClick={() => onDelete(report.id)}
                >
                  Delete Report
                </button>
              </div>
            )}

            {editingReportId === report.id && (
              <form
                onSubmit={onUpdate}
                className="booking-form"
              >
                <h3>Edit Medical Test Report</h3>

                <label>Test Name</label>
                <input
                  value={editReport.testName}
                  onChange={(e) => onEditChange('testName', e.target.value)}
                  required
                />

                <label>Test Date</label>
                <input
                  type="date"
                  value={editReport.testDate}
                  onChange={(e) => onEditChange('testDate', e.target.value)}
                  required
                />

                <label>Result</label>
                <textarea
                  value={editReport.result}
                  onChange={(e) => onEditChange('result', e.target.value)}
                  required
                />

                <label>Notes</label>
                <textarea
                  value={editReport.notes}
                  onChange={(e) => onEditChange('notes', e.target.value)}
                />

                <button className="submit-btn" type="submit">
                  Save Changes
                </button>

                <button
                  className="submit-btn"
                  type="button"
                  onClick={onCancelEdit}
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        ))}

        {filteredReports.length === 0 && (
          <p>No medical test reports available yet.</p>
        )}
      </div>
    </section>
  )
}