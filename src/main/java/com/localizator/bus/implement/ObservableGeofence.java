package com.localizator.bus.implement;

import com.localizator.bus.dto.Geofence;
import com.localizator.bus.entity.Place;
import com.localizator.bus.repository.PlaceRepository;
import com.localizator.bus.service.LocalizationService;

public class ObservableGeofence implements Runnable {

    private Place place;

    private PlaceRepository placeRepository;

    public ObservableGeofence(Place place, PlaceRepository placeRepository) {
        this.place = place;
        this.placeRepository = placeRepository;
    }

    @Override
    public void run() {
        Geofence geoference = LocalizationService.createGeoferenceByPlace(place);
        place.setGeoferenceId(geoference.getId());
        place.setGeoference(geoference.getArea());
    }
}
