import type { Patient, Appointment, Billing } from '../../types'

interface BillingManagementProps {
  bills: Billing[]
  patients: Patient[]
  appointments: Appointment[]
  userRole: string
  billingPatientId: string
  billingAppointmentId: string
  additionalCharges: string
  discount: string
  billingMessage: string
  billingLoading: boolean
  paymentAmounts: Record<number, string>
  paymentMessage: string
  formatDate: (date: string) => string
  onPatientChange: (value: string) => void
  onAppointmentChange: (value: string) => void
  onChargesChange: (value: string) => void
  onDiscountChange: (value: string) => void
  onPaymentAmountChange: (billId: number, value: string) => void
  onGenerateBill: (event: React.FormEvent<HTMLFormElement>) => void
  onRecordPayment: (billId: number) => void
  onPrintInvoice: (bill: Billing) => void
}

export default function BillingManagement({
  bills,
  patients,
  appointments,
  userRole,
  billingPatientId,
  billingAppointmentId,
  additionalCharges,
  discount,
  billingMessage,
  billingLoading,
  paymentAmounts,
  paymentMessage,
  formatDate,
  onPatientChange,
  onAppointmentChange,
  onChargesChange,
  onDiscountChange,
  onPaymentAmountChange,
  onGenerateBill,
  onRecordPayment,
  onPrintInvoice,
}: BillingManagementProps) {
  return (
    <section className="content-card">
      <div className="section-heading">
        <div>
          <h2>Billing & Payments</h2>
          <p>Manage patient invoices and payments</p>
        </div>

        <span className="count-label">
          {bills.length} Bills
        </span>
      </div>

      {userRole === 'ADMIN' && (
        <div className="booking-form">
          <h2>Generate New Bill</h2>
          <p>Create an invoice for a registered patient.</p>

          <form onSubmit={onGenerateBill}>
            <label>Patient</label>
            <select
              value={billingPatientId}
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

            <label>Appointment (Optional)</label>
            <select
              value={billingAppointmentId}
              onChange={(e) => onAppointmentChange(e.target.value)}
            >
              <option value="">No appointment selected</option>
              {appointments
                .filter(
                  (appointment) =>
                    String(appointment.patient?.id) === billingPatientId &&
                    appointment.doctor
                )
                .map((appointment) => (
                  <option key={appointment.id} value={appointment.id}>
                    {appointment.doctorName} - {formatDate(appointment.appointmentDateTime)}
                  </option>
                ))}
            </select>

            <label>Additional Charges (₹)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={additionalCharges}
              onChange={(e) => onChargesChange(e.target.value)}
            />

            <label>Discount (₹)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={discount}
              onChange={(e) => onDiscountChange(e.target.value)}
            />

            <button
              className="submit-btn"
              type="submit"
              disabled={billingLoading}
            >
              {billingLoading ? 'Generating...' : '+ Generate Bill'}
            </button>
          </form>

          {billingMessage && (
            <p className="form-message">{billingMessage}</p>
          )}
        </div>
      )}

      {paymentMessage && (
        <p className="form-message">{paymentMessage}</p>
      )}

      <div className="patient-grid">
        {bills.map((bill) => (
          <div className="patient-card" key={bill.id}>
            <h3>{bill.billNumber}</h3>

            <p>Patient: {bill.patient?.name}</p>
            <p>Doctor: {bill.doctorName}</p>
            <p>Date: {formatDate(bill.billDate)}</p>

            <p>
              Total: ₹{Number(bill.totalAmount).toFixed(2)}
            </p>

            <p>
              Paid: ₹{Number(bill.amountPaid).toFixed(2)}
            </p>

            <p>Status: {bill.paymentStatus}</p>

            {userRole === 'ADMIN' && bill.paymentStatus !== 'PAID' && (
              <div className="booking-form">
                <label>Record Payment (₹)</label>

                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="Enter payment amount"
                  value={paymentAmounts[bill.id] || ''}
                  onChange={(e) =>
                    onPaymentAmountChange(bill.id, e.target.value)
                  }
                />

                <button
                  className="submit-btn"
                  type="button"
                  onClick={() => onRecordPayment(bill.id)}
                >
                  Record Payment
                </button>
              </div>
            )}

            <button
              className="submit-btn"
              type="button"
              onClick={() => onPrintInvoice(bill)}
            >
              🖨 Print Invoice
            </button>
          </div>
        ))}

        {bills.length === 0 && (
          <p>No bills generated yet.</p>
        )}
      </div>
    </section>
  )
}