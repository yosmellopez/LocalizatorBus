package com.localizator.bus.entity;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class PassengerTravelPK implements Serializable {

    @Column(name = "passenger_id")
    private Long passengerId;

    @Column(name = "travel_id")
    private Long travelId;

    public PassengerTravelPK() {
    }

    public PassengerTravelPK(Long passengerId, Long travelId) {
        this.passengerId = passengerId;
        this.travelId = travelId;
    }

    public Long getPassengerId() {
        return passengerId;
    }

    public void setPassengerId(Long passengerId) {
        this.passengerId = passengerId;
    }

    public Long getTravelId() {
        return travelId;
    }

    public void setTravelId(Long travelId) {
        this.travelId = travelId;
    }

    @Override
    public int hashCode() {

        return Objects.hash(passengerId, travelId);
    }
}
