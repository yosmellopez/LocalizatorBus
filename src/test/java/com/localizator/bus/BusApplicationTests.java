package com.localizator.bus;

import com.localizator.bus.dto.*;
import com.localizator.bus.entity.Device;
import com.localizator.bus.entity.Place;
import com.localizator.bus.repository.DeviceRepository;
import com.localizator.bus.repository.PassengerTravelRepository;
import com.localizator.bus.repository.PlaceRepository;
import com.localizator.bus.service.LocalizationService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RunWith(SpringRunner.class)
@SpringBootTest
public class BusApplicationTests {

    @Autowired
    PassengerTravelRepository passengerTravelRepository;

    @Autowired
    PlaceRepository placeRepository;

    @Autowired
    DeviceRepository deviceRepository;

    @Test
    public void contextLoads() {
//        Gisgraphy gisgraphy = LocalizationService.getAutoComplete("Las Tunas");
//        Set<Result> results = gisgraphy.getResponse().getResult();
//        for (Result result : results) {
//            System.out.println(result);
//        }
//        List<TraccarPosition> positions = LocalizationService.listPositions();
//        Optional<TraccarPosition> optional = positions.parallelStream().filter(traccarPosition -> traccarPosition.getDeviceId() == 1).findFirst();
//        optional.ifPresent(System.out::println);
        List<Place> places = placeRepository.findAll();
        places.forEach(place -> {
            Geofence geoference = LocalizationService.createGeoferenceByPlace(place);
            place.setGeoferenceId(geoference.getId());
            place.setGeoference(geoference.getArea());
            placeRepository.saveAndFlush(place);
        });
        List<Geofence> geofences = LocalizationService.listGeofence();
        geofences.forEach(System.out::println);
    }

    @Test
    public void createDevice() {
        List<Device> devices = deviceRepository.findAll();
        devices.forEach(device -> {
            List<Device> deviceList = LocalizationService.listDevicesByUniqueId(device);
            if (deviceList.isEmpty()) {
                TraccarDevice traccarDevice = LocalizationService.createDevice(device);
            }
        });

    }
}
