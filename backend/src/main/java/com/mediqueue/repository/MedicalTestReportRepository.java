package com.mediqueue.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mediqueue.entity.MedicalTestReport;

public interface MedicalTestReportRepository
        extends JpaRepository<MedicalTestReport, Long> {

    List<MedicalTestReport> findByPatientId(Long patientId);
}