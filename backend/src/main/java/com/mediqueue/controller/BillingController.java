
package com.mediqueue.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mediqueue.entity.Billing;
import com.mediqueue.service.BillingService;

@RestController
@RequestMapping("/api/billing")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class BillingController {

    private final BillingService billingService;

    public BillingController(BillingService billingService) {
        this.billingService = billingService;
    }

    @GetMapping
    public List<Billing> getAllBills() {
        return billingService.getAllBills();
    }

    @GetMapping("/{id}")
    public Billing getBillById(@PathVariable Long id) {
        return billingService.getBillById(id);
    }

    @GetMapping("/patient/{patientId}")
    public List<Billing> getBillsByPatient(
            @PathVariable Long patientId) {
        return billingService.getBillsByPatient(patientId);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Billing createBill(@RequestBody Map<String, Object> request) {

        Long patientId = Long.valueOf(request.get("patientId").toString());

        Long appointmentId = request.get("appointmentId") == null
                ? null
                : Long.valueOf(request.get("appointmentId").toString());

        BigDecimal additionalCharges = new BigDecimal(
                request.getOrDefault("additionalCharges", "0").toString());

        BigDecimal discount = new BigDecimal(
                request.getOrDefault("discount", "0").toString());

        return billingService.createBill(
                patientId,
                appointmentId,
                additionalCharges,
                discount);
    }

    @PostMapping("/{id}/payment")
    @PreAuthorize("hasRole('ADMIN')")
    public Billing recordPayment(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request) {

        BigDecimal amount = new BigDecimal(
                request.get("amount").toString());

        return billingService.recordPayment(id, amount);
    }
}
