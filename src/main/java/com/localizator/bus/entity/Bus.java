package com.localizator.bus.entity;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "bus", uniqueConstraints = {
        @UniqueConstraint(name = "unique_bus_code", columnNames = {"code"}),
        @UniqueConstraint(name = "unique_bus_number", columnNames = {"number"})
})
public class Bus implements Serializable, ClonableEntity<Bus> {

    @Id
    @Column(name = "bus_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "site_number")
    @NotNull(message = "bus_site_number_not_null")
    @Min(value = 2, message = "bus_site_number_min")
    @Max(value = 100, message = "bus_site_number_max")
    private Integer siteNumber;

    @Column(name = "code")
    @NotNull(message = "bus_code_not_null")
    private String code;

    @Column(name = "number")
    @NotNull(message = "bus_number_not_null")
    private Integer number;

    @ManyToOne(optional = false)
    @NotNull(message = "bus_company_not_null")
    @JoinColumn(name = "company_id", foreignKey = @ForeignKey(name = "fk_bus_company"))
    private Company company;

    public Bus() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getSiteNumber() {
        return siteNumber;
    }

    public void setSiteNumber(Integer siteNumber) {
        this.siteNumber = siteNumber;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Integer getNumber() {
        return number;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    @Override
    public void clone(Bus bus) {
        siteNumber = bus.siteNumber;
        code = bus.code;
        number = bus.number;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Bus bus = (Bus) o;
        return Objects.equals(id, bus.id);
    }

    @Override
    public int hashCode() {

        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Bus{" +
                "id=" + id +
                ", siteNumber=" + siteNumber +
                ", code='" + code + '\'' +
                ", number=" + number +
                '}';
    }
}
