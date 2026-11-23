
package com.mediqueue.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.mediqueue.entity.MedicalTestReport;
import com.mediqueue.entity.Patient;
import com.mediqueue.repository.MedicalTestReportRepository;
import com.mediqueue.repository.PatientRepository;

@Service
public class MedicalTestReportService {

    private final MedicalTestReportRepository reportRepository;
    private final PatientRepository patientRepository;

    public MedicalTestReportService(
            MedicalTestReportRepository reportRepository,
            PatientRepository patientRepository) {
        this.reportRepository = reportRepository;
        this.patientRepository = patientRepository;
    }

    public List<MedicalTestReport> getAllReports() {
        return reportRepository.findAll();
    }

    public List<MedicalTestReport> getReportsByPatient(Long patientId) {
        return reportRepository.findByPatientId(patientId);
    }

    public MedicalTestReport getReportById(Long id) {
        return reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));
    }

    public MedicalTestReport createReport(
            Long patientId, MedicalTestReport report) {

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        report.setPatient(patient);

        return reportRepository.save(report);
    }

    public MedicalTestReport updateReport(
            Long id, MedicalTestReport updatedReport) {

        MedicalTestReport report = getReportById(id);

        report.setTestName(updatedReport.getTestName());
        report.setTestDate(updatedReport.getTestDate());
        report.setResult(updatedReport.getResult());
        report.setNotes(updatedReport.getNotes());

        return reportRepository.save(report);
    }

    public void deleteReport(Long id) {
        MedicalTestReport report = getReportById(id);
        reportRepository.delete(report);
    }
}
