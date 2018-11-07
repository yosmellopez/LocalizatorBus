package com.localizator.bus.entity;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

@Entity
@Table(name = "passenger", uniqueConstraints = {@UniqueConstraint(name = "unique_passenger_dni", columnNames = {"dni"})})
public class Passenger implements Serializable, ClonableEntity<Passenger> {

    @Id
    @Column(name = "passenger_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "dni")
    @NotNull(message = "passenger_dni_not_null")
    private String dni;

    @Column(name = "name")
    @NotNull(message = "")
    private String name;

    @Column(name = "lastname")
    @NotNull(message = "")
    private String lastname;

    public Passenger() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    @Override
    public void clone(Passenger passenger) {
        name = passenger.name;
        lastname = passenger.lastname;
        dni = passenger.dni;
    }
}
