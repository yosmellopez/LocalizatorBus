package com.localizator.bus.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.localizator.bus.json.TimeDeserializer;
import com.localizator.bus.json.TimeSerializer;
import org.hibernate.annotations.ColumnDefault;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "travel")
public class Travel implements Serializable, ClonableEntity<Travel> {

    @Id
    @Column(name = "travel_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "active")
    @ColumnDefault(value = "false")
    @NotNull(message = "travel_active_not_null")
    private Boolean active;

    @ManyToOne(optional = false)
    @NotNull(message = "travel_route_not_null")
    @JoinColumn(name = "route_id", foreignKey = @ForeignKey(name = "fk_travel_route"))
    private Route route;

    @Column(name = "travel_date")
    @NotNull(message = "travel_date_not_null")
    @Temporal(TemporalType.DATE)
    private Date travelDate;

    @Column(name = "arrive_date")
    @NotNull(message = "travel_arrive_not_null")
    @Temporal(TemporalType.DATE)
    private Date arriveDate;

    @Temporal(TemporalType.TIME)
    @Column(name = "travel_time")
    @JsonSerialize(using = TimeSerializer.class)
    @JsonDeserialize(using = TimeDeserializer.class)
    @NotNull(message = "travel_time_not_null")
    private Date travelTime;

    @Temporal(TemporalType.TIME)
    @Column(name = "arrive_time")
    @JsonSerialize(using = TimeSerializer.class)
    @JsonDeserialize(using = TimeDeserializer.class)
    @NotNull(message = "travel_time_not_null")
    private Date arriveTime;

    @ManyToOne(optional = false)
    @NotNull(message = "travel_bus_not_null")
    @JoinColumn(name = "bus_id", foreignKey = @ForeignKey(name = "fk_travel_bus"))
    private Bus bus;

    @OneToMany(mappedBy = "travel")
    private List<PassengerTravel> passengerTravels = new ArrayList<>();

    public Travel() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Bus getBus() {
        return bus;
    }

    public void setBus(Bus bus) {
        this.bus = bus;
    }

    public Date getTravelDate() {
        return travelDate;
    }

    public void setTravelDate(Date travelDate) {
        this.travelDate = travelDate;
    }

    public Date getArriveDate() {
        return arriveDate;
    }

    public void setArriveDate(Date arriveDate) {
        this.arriveDate = arriveDate;
    }

    public Route getRoute() {
        return route;
    }

    public void setRoute(Route route) {
        this.route = route;
    }

    public List<PassengerTravel> getPassengerTravels() {
        return passengerTravels;
    }

    public void setPassengerTravels(List<PassengerTravel> passengerTravels) {
        this.passengerTravels = passengerTravels;
    }

    public Date getTravelTime() {
        return travelTime;
    }

    public void setTravelTime(Date travelTime) {
        this.travelTime = travelTime;
    }

    public Date getArriveTime() {
        return arriveTime;
    }

    public void setArriveTime(Date arriveTime) {
        this.arriveTime = arriveTime;
    }

    @Override
    public void clone(Travel travel) {
        active = travel.active;
        route = travel.route;
        arriveDate = travel.arriveDate;
        travelDate = travel.travelDate;
        travelTime = travel.travelTime;
        arriveTime = travel.arriveTime;
        bus = travel.bus;
    }

    @Override
    public String toString() {
        return "Travel{" +
                "id=" + id +
                ", active=" + active +
                ", route=" + route +
                ", travelDate=" + travelDate +
                ", arriveDate=" + arriveDate +
                ", travelTime=" + travelTime +
                ", arriveTime=" + arriveTime +
                ", bus=" + bus +
                '}';
    }
}
