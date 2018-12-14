package com.localizator.bus.entity;

import org.hibernate.annotations.ColumnDefault;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "place", uniqueConstraints = {@UniqueConstraint(name = "place_name_unique", columnNames = {"name"})})
public class Place implements Serializable, ClonableEntity<Place> {

    @Id
    @Column(name = "place_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    @NotNull(message = "place_name_not_null")
    @Size(min = 1, max = 255, message = "place_name_min_max_size")
    private String name;

    @Column(name = "address")
    @NotNull(message = "place_address_not_null")
    @Size(min = 1, max = 5000, message = "place_address_min_max_size")
    private String address;

    @Column(name = "stretch")
    @ColumnDefault(value = "false")
    private Boolean stretch = false;

    @Column(name = "lat")
    @ColumnDefault(value = "0")
    @NotNull(message = "place_latitude_not_null")
    private Double lat;

    @Column(name = "lon")
    @ColumnDefault(value = "0")
    @NotNull(message = "place_longitude_not_null")
    private Double lon;

    @Column(name = "geoference")
    private String geoference;

    @Column(name = "postal_code", length = 10)
    private Integer postalCode;

    public Place() {
    }

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


    public String getGeoference() {
        return geoference;
    }

    public void setGeoference(String geoference) {
        this.geoference = geoference;
    }

    public Integer getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(Integer postalCode) {
        this.postalCode = postalCode;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Boolean getStretch() {
        return stretch;
    }

    public void setStretch(Boolean stretch) {
        this.stretch = stretch;
    }

    public Double getLat() {
        return lat;
    }

    public void setLat(Double lat) {
        this.lat = lat;
    }

    public Double getLon() {
        return lon;
    }

    public void setLon(Double lon) {
        this.lon = lon;
    }

    @Override
    public void clone(Place place) {
        name = place.name;
        postalCode = place.postalCode;
        geoference = place.geoference;
        address = place.address;
        stretch = place.stretch;
        lat = place.lat;
        lon = place.lon;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Place place = (Place) o;
        return Objects.equals(id, place.id);
    }

    @Override
    public int hashCode() {

        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Place{" + "id=" + id + ", name='" + name + '\'' + '}';
    }
}
