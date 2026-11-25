
package com.mediqueue.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mediqueue.entity.Billing;

public interface BillingRepository extends JpaRepository<Billing, Long> {

    List<Billing> findByPatientId(Long patientId);
List<Billing> findByAppointmentPatientId(Long patientId);
    boolean existsByBillNumber(String billNumber);
    boolean existsByPatientId(Long patientId);
}
