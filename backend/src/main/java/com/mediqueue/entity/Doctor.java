
package com.mediqueue.entity;

import java.time.LocalTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "doctors")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String specialization;
    private String phone;
    private String email;
    private double consultationFee;

    private String availableDays;

    private LocalTime morningStartTime;
    private LocalTime morningEndTime;

    private LocalTime eveningStartTime;
    private LocalTime eveningEndTime;

    public Doctor() {
    }

    public Doctor(String name, String specialization,
                  String phone, String email, double consultationFee) {
        this.name = name;
        this.specialization = specialization;
        this.phone = phone;
        this.email = email;
        this.consultationFee = consultationFee;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getSpecialization() {
        return specialization;
    }

    public String getPhone() {
        return phone;
    }

    public String getEmail() {
        return email;
    }

    public double getConsultationFee() {
        return consultationFee;
    }

    public String getAvailableDays() {
        return availableDays;
    }

    public LocalTime getMorningStartTime() {
        return morningStartTime;
    }

    public LocalTime getMorningEndTime() {
        return morningEndTime;
    }

    public LocalTime getEveningStartTime() {
        return eveningStartTime;
    }

    public LocalTime getEveningEndTime() {
        return eveningEndTime;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setConsultationFee(double consultationFee) {
        this.consultationFee = consultationFee;
    }

    public void setAvailableDays(String availableDays) {
        this.availableDays = availableDays;
    }

    public void setMorningStartTime(LocalTime morningStartTime) {
        this.morningStartTime = morningStartTime;
    }

    public void setMorningEndTime(LocalTime morningEndTime) {
        this.morningEndTime = morningEndTime;
    }

    public void setEveningStartTime(LocalTime eveningStartTime) {
        this.eveningStartTime = eveningStartTime;
    }

    public void setEveningEndTime(LocalTime eveningEndTime) {
        this.eveningEndTime = eveningEndTime;
    }
}
