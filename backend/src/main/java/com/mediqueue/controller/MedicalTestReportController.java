
package com.mediqueue.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mediqueue.entity.MedicalTestReport;
import com.mediqueue.service.MedicalTestReportService;

@RestController
@RequestMapping("/api/test-reports")
public class MedicalTestReportController {

    private final MedicalTestReportService reportService;

    public MedicalTestReportController(
            MedicalTestReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping
    public List<MedicalTestReport> getAllReports() {
        return reportService.getAllReports();
    }

    @GetMapping("/patient/{patientId}")
    public List<MedicalTestReport> getReportsByPatient(
            @PathVariable Long patientId) {
        return reportService.getReportsByPatient(patientId);
    }

    @GetMapping("/{id}")
    public MedicalTestReport getReportById(@PathVariable Long id) {
        return reportService.getReportById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public MedicalTestReport createReport(
            @RequestParam Long patientId,
            @RequestBody MedicalTestReport report) {
        return reportService.createReport(patientId, report);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public MedicalTestReport updateReport(
            @PathVariable Long id,
            @RequestBody MedicalTestReport report) {
        return reportService.updateReport(id, report);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteReport(@PathVariable Long id) {
        reportService.deleteReport(id);
        return ResponseEntity.noContent().build();
    }
}
