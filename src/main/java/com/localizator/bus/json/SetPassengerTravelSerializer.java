package com.localizator.bus.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.localizator.bus.entity.PassengerTravel;
import com.localizator.bus.entity.Travel;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

public class SetPassengerTravelSerializer extends JsonSerializer<Set<PassengerTravel>> {

    @Override
    public void serialize(Set<PassengerTravel> passengerTravels, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        Set<PassengerTravel> travelPlaces = new HashSet<>();
        Travel travelNew = new Travel();
        for (PassengerTravel passengerTravel : passengerTravels) {
            Travel travel = passengerTravel.getTravel();
            travelNew.setBus(travel.getBus());
            travelNew.setTravelDate(travel.getTravelDate());
            passengerTravel.setTravel(travelNew);
            travelPlaces.add(passengerTravel);
        }
        jsonGenerator.writeObject(travelPlaces);
    }
}
