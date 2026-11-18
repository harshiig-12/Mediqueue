
package com.mediqueue.entity;

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
}
