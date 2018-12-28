package com.localizator.bus;

import com.localizator.bus.dto.Geofence;
import com.localizator.bus.entity.Place;
import com.localizator.bus.implement.SimpleEchoSocket;
import com.localizator.bus.repository.DeviceRepository;
import com.localizator.bus.repository.PassengerTravelRepository;
import com.localizator.bus.repository.PlaceRepository;
import com.localizator.bus.service.LocalizationService;
import org.eclipse.jetty.websocket.client.ClientUpgradeRequest;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.eclipse.jetty.websocket.client.WebSocketClient;

import java.net.URI;
import java.util.List;
import java.util.concurrent.TimeUnit;

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
//
//    @Test
//    public void createDevice() {
//        List<Device> devices = deviceRepository.findAll();
//        devices.forEach(device -> {
//            List<Device> deviceList = LocalizationService.listDevicesByUniqueId(device);
//            if (deviceList.isEmpty()) {
//                TraccarDevice traccarDevice = LocalizationService.createDevice(device);
//            }
//        });
//
//}

    @Test
    public void webSocket() {
        String destUri = "ws://localhost:8082/api/socket";
        WebSocketClient client = new WebSocketClient();
        SimpleEchoSocket socket = new SimpleEchoSocket();
        try {
            client.start();
            URI echoUri = new URI(destUri);
            ClientUpgradeRequest request = new ClientUpgradeRequest();
            client.connect(socket, echoUri, request);
            System.out.printf("Connecting to : %s%n", echoUri);

            // wait for closed socket connection.
            socket.awaitClose(10005, TimeUnit.SECONDS);
        } catch (Throwable t) {
            t.printStackTrace();
        } finally {
            try {
                client.stop();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
