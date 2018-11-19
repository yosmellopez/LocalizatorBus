package com.localizator.bus.entity;

import javax.persistence.*;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

@Entity
@Table(name = "company", uniqueConstraints = {@UniqueConstraint(name = "company_unique_name", columnNames = {})})
public class Company implements Serializable, ClonableEntity<Company> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "company_id")
    private Long id;

    @Column(name = "name")
    @NotNull(message = "company_name_not_null")
    private String name;

    @Column(name = "bus_cont")
    @NotNull(message = "company_bus_count_not_null")
    @Min(message = "company_min_bus_count", value = 1)
    private Integer busCount;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getBusCount() {
        return busCount;
    }

    public void setBusCount(Integer busCount) {
        this.busCount = busCount;
    }

    @Override
    public void clone(Company company) {
        name = company.name;
        busCount = company.busCount;
    }
}
