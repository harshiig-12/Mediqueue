
package com.mediqueue.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mediqueue.entity.Appointment;
import com.mediqueue.service.AppointmentService;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "http://localhost:5173")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @GetMapping("/{id}")
    public Appointment getAppointmentById(@PathVariable Long id) {
        return appointmentService.getAppointmentById(id);
    }

    @PostMapping("/{patientId}/{doctorId}")
    public Appointment createAppointment(
            @RequestBody Appointment appointment,
            @PathVariable Long patientId,
            @PathVariable Long doctorId) {
        return appointmentService.createAppointment(appointment, patientId, doctorId);
    }

    @PutMapping("/{id}/reschedule")
    public Appointment rescheduleAppointment(
            @PathVariable Long id,
            @RequestBody RescheduleRequest request) {
        return appointmentService.rescheduleAppointment(
                id, request.getDoctorId(), request.getNewStart());
    }

    @PutMapping("/{id}/complete")
    public Appointment completeAppointment(@PathVariable Long id) {
        return appointmentService.completeAppointment(id);
    }

    @PutMapping("/{id}/cancel")
    public Appointment cancelAppointment(@PathVariable Long id) {
        return appointmentService.cancelAppointment(id);
    }

    @DeleteMapping("/{id}")
    public String deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return "Appointment deleted successfully";
    }

    public static class RescheduleRequest {
        private Long doctorId;
        private LocalDateTime newStart;

        public Long getDoctorId() {
            return doctorId;
        }

        public void setDoctorId(Long doctorId) {
            this.doctorId = doctorId;
        }

        public LocalDateTime getNewStart() {
            return newStart;
        }

        public void setNewStart(LocalDateTime newStart) {
            this.newStart = newStart;
        }
    }
}
