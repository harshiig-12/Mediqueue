interface PatientRegistrationFormProps {
  newName: string
  newAge: string
  newGender: string
  newPhone: string
  newEmail: string
  newDateOfBirth: string
  registrationMessage: string
  onNameChange: (value: string) => void
  onAgeChange: (value: string) => void
  onGenderChange: (value: string) => void
  onPhoneChange: (value: string) => void
  onEmailChange: (value: string) => void
  onDateOfBirthChange: (value: string) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export default function PatientRegistrationForm({
  newName,
  newAge,
  newGender,
  newPhone,
  newEmail,
  newDateOfBirth,
  registrationMessage,
  onNameChange,
  onAgeChange,
  onGenderChange,
  onPhoneChange,
  onEmailChange,
  onDateOfBirthChange,
  onSubmit,
}: PatientRegistrationFormProps) {
  return (
    <section className="content-card">
      <div className="section-heading">
        <div>
          <h2>Register New Patient</h2>
          <p>
            Enter patient details to add them to the hospital database.
          </p>
        </div>
      </div>

      <div className="booking-form">
        <form onSubmit={onSubmit}>
          <label>Patient Name</label>
          <input
            value={newName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Enter full name"
            required
          />

          <label>Age</label>
          <input
            type="number"
            min="0"
            max="120"
            value={newAge}
            onChange={(e) => onAgeChange(e.target.value)}
            placeholder="Enter age"
            required
          />

          <label>Gender</label>
          <select
            value={newGender}
            onChange={(e) => onGenderChange(e.target.value)}
            required
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <label>Phone Number</label>
          <input
            type="tel"
            value={newPhone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="Enter phone number"
            required
          />

          <label>Email</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="Enter email address"
            required
          />

          <label>Date of Birth</label>
          <input
            type="date"
            value={newDateOfBirth}
            onChange={(e) => onDateOfBirthChange(e.target.value)}
            required
          />

          <button className="submit-btn" type="submit">
            + Register Patient
          </button>

          {registrationMessage && (
            <p className="form-message">{registrationMessage}</p>
          )}
        </form>
      </div>
    </section>
  )
}