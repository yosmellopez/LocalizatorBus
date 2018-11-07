package com.localizator.bus.entity;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.localizator.bus.json.TravelSerializer;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Objects;
import java.util.Optional;

@Entity
@Table(name = "passenger_travel")
public class PassengerTravel implements Serializable, ClonableEntity<PassengerTravel> {

    @EmbeddedId
    private PassengerTravelPK passengerTravelPK;

    @ManyToOne(optional = false)
    @NotNull(message = "passenger_travel_passenger_not_null")
    @JoinColumn(name = "passenger_id", insertable = false, updatable = false, foreignKey = @ForeignKey(name = "fk_passenger_place"))
    private Passenger passenger;

    @ManyToOne(optional = false)
    @NotNull(message = "passenger_travel_place_not_null")
    @JoinColumn(name = "place_id", foreignKey = @ForeignKey(name = "fk_place_passenger"))
    private Place place;

    @ManyToOne(optional = false)
    @NotNull(message = "passenger_travel_travel_not_null")
    @JoinColumn(name = "travel_id", insertable = false, updatable = false, foreignKey = @ForeignKey(name = "fk_travel_passenger"))
    @JsonSerialize(using = TravelSerializer.class)
    private Travel travel;

    public PassengerTravel() {
    }

    public PassengerTravelPK getPassengerTravelPK() {
        return passengerTravelPK;
    }

    public void setPassengerTravelPK(PassengerTravelPK passengerTravelPK) {
        this.passengerTravelPK = passengerTravelPK;
    }

    @PrePersist
    private void createPk() {
        if (!Optional.ofNullable(passengerTravelPK).isPresent()) {
            passengerTravelPK = new PassengerTravelPK(passenger.getId(), travel.getId());
        }
    }

    public Passenger getPassenger() {
        return passenger;
    }

    public void setPassenger(Passenger passenger) {
        this.passenger = passenger;
    }

    public Place getPlace() {
        return place;
    }

    public void setPlace(Place place) {
        this.place = place;
    }

    public Travel getTravel() {
        return travel;
    }

    public void setTravel(Travel travel) {
        this.travel = travel;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PassengerTravel that = (PassengerTravel) o;
        return Objects.equals(passengerTravelPK, that.passengerTravelPK);
    }

    @Override
    public int hashCode() {

        return Objects.hash(passengerTravelPK);
    }

    @Override
    public void clone(PassengerTravel passengerTravel) {
        passenger = passengerTravel.passenger;
        travel = passengerTravel.travel;
        place = passengerTravel.place;
    }
}
