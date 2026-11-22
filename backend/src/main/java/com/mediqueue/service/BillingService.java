
package com.mediqueue.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mediqueue.entity.Appointment;
import com.mediqueue.entity.Billing;
import com.mediqueue.entity.Patient;
import com.mediqueue.repository.AppointmentRepository;
import com.mediqueue.repository.BillingRepository;
import com.mediqueue.repository.PatientRepository;

@Service
public class BillingService {

    private final BillingRepository billingRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;

    public BillingService(
            BillingRepository billingRepository,
            PatientRepository patientRepository,
            AppointmentRepository appointmentRepository) {
        this.billingRepository = billingRepository;
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
    }

    public List<Billing> getAllBills() {
        return billingRepository.findAll();
    }

    public List<Billing> getBillsByPatient(Long patientId) {
        return billingRepository.findByPatientId(patientId);
    }

    public Billing getBillById(Long id) {
        return billingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bill not found"));
    }

    @Transactional
    public Billing createBill(
            Long patientId,
            Long appointmentId,
            BigDecimal additionalCharges,
            BigDecimal discount) {

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Appointment appointment = null;
        BigDecimal consultationFee = BigDecimal.ZERO;
        String doctorName = "Not assigned";

        if (appointmentId != null) {
            appointment = appointmentRepository.findById(appointmentId)
                    .orElseThrow(() -> new RuntimeException("Appointment not found"));

            if (!appointment.getPatient().getId().equals(patientId)) {
                throw new IllegalArgumentException(
                        "Appointment does not belong to this patient");
            }

            if (appointment.getDoctor() != null) {
                consultationFee = BigDecimal.valueOf(
                        appointment.getDoctor().getConsultationFee());
                doctorName = appointment.getDoctor().getName();
            } else {
                throw new IllegalArgumentException(
                        "Cannot generate an appointment bill because its doctor is not assigned");
            }
        }

        validateAmount(additionalCharges, "Additional charges");
        validateAmount(discount, "Discount");

        Billing bill = new Billing();
        bill.setBillNumber(generateBillNumber());
        bill.setBillDate(LocalDateTime.now());
        bill.setPatient(patient);
        bill.setAppointment(appointment);
        bill.setDoctorName(doctorName);
        bill.setConsultationFee(consultationFee);
        bill.setAdditionalCharges(additionalCharges);
        bill.setDiscount(discount);

        BigDecimal total = consultationFee
                .add(additionalCharges)
                .subtract(discount);

        if (total.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException(
                    "Discount cannot exceed the bill amount");
        }

        bill.setTotalAmount(total);
        bill.setAmountPaid(BigDecimal.ZERO);
        bill.setPaymentStatus("PENDING");

        return billingRepository.save(bill);
    }

    @Transactional
    public Billing recordPayment(Long billId, BigDecimal amount) {

        Billing bill = getBillById(billId);

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(
                    "Payment amount must be greater than zero");
        }

        BigDecimal newAmountPaid = bill.getAmountPaid().add(amount);

        if (newAmountPaid.compareTo(bill.getTotalAmount()) > 0) {
            throw new IllegalArgumentException(
                    "Payment cannot exceed the remaining bill amount");
        }

        bill.setAmountPaid(newAmountPaid);

        if (newAmountPaid.compareTo(bill.getTotalAmount()) == 0) {
            bill.setPaymentStatus("PAID");
        } else {
            bill.setPaymentStatus("PARTIALLY_PAID");
        }

        return billingRepository.save(bill);
    }

    private String generateBillNumber() {
        String billNumber;

        do {
            billNumber = "MQ-" + System.currentTimeMillis();
        } while (billingRepository.existsByBillNumber(billNumber));

        return billNumber;
    }

    private void validateAmount(BigDecimal amount, String fieldName) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException(
                    fieldName + " cannot be negative or null");
        }
    }
}
