package com.localizator.bus.entity;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "route", uniqueConstraints = {
        @UniqueConstraint(name = "unique_route_origin_destiny", columnNames = {"origin_place", "destiny_place"}),
        @UniqueConstraint(name = "unique_route_code", columnNames = {"code"})
})
public class Route {

    @Id
    @Column(name = "route_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code")
    @NotNull(message = "route_code_not_null")
    private String code;

    @ManyToOne(optional = false)
    @NotNull(message = "route_origin_not_null")
    @JoinColumn(name = "origin_place", foreignKey = @ForeignKey(name = "fk_place_origin_route"))
    private Place origin;

    @ManyToOne(optional = false)
    @NotNull(message = "route_destiny_not_null")
    @JoinColumn(name = "destiny_place", foreignKey = @ForeignKey(name = "fk_place_destiny_route"))
    private Place destiny;

    @ManyToMany
    @JoinTable(name = "place_route",
            joinColumns = @JoinColumn(name = "route_id", foreignKey = @ForeignKey(name = "fk_route_place")),
            inverseJoinColumns = @JoinColumn(name = "place_id", foreignKey = @ForeignKey(name = "fk_place_route")))
    private Set<Place> places = new HashSet<>();

    public Route() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Place getOrigin() {
        return origin;
    }

    public void setOrigin(Place origin) {
        this.origin = origin;
    }

    public Place getDestiny() {
        return destiny;
    }

    public void setDestiny(Place destiny) {
        this.destiny = destiny;
    }

    public Set<Place> getPlaces() {
        return places;
    }

    public void setPlaces(Set<Place> places) {
        this.places = places;
    }

    @PostLoad
    public void loadRoutes() {
        places.add(destiny);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Route route = (Route) o;
        return Objects.equals(id, route.id);
    }

    @Override
    public int hashCode() {

        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Route{" +
                "id=" + id +
                ", code='" + code + '\'' +
                ", origin=" + origin +
                ", destiny=" + destiny +
                '}';
    }
}
