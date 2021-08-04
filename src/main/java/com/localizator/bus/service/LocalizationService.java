package com.localizator.bus.service;

import com.localizator.bus.dto.*;
import com.localizator.bus.entity.Device;
import com.localizator.bus.entity.Place;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Objects;


public class LocalizationService {

    public static Localization getLocalizationByCoord(Posicion posicion) {
        String fooResourceUrl = "https://nominatim.openstreetmap.org/reverse";
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(fooResourceUrl)
                .queryParam("format", "json")
                .queryParam("lat", posicion.getLatitud())
                .queryParam("lon", posicion.getLongitud())
                .queryParam("zoom", 18)
                .queryParam("addressdetails", 1);

        WebClient webClient = WebClient.builder().baseUrl(builder.toUriString()).defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE).build();
        return webClient.get().retrieve().bodyToMono(Localization.class).block();
    }

    public static Gisgraphy getAutoComplete(String query) {
        String fooResourceUrl = "https://services.gisgraphy.com/fulltext/fulltextsearch";
        UriComponents builder = UriComponentsBuilder.fromHttpUrl(fooResourceUrl)
                .queryParam("format", "json")
                .queryParam("q", query).build().encode();
        String uriString = builder.toUriString();
        WebClient webClient = WebClient.builder().baseUrl(uriString.replace("%20", "+"))
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
        return webClient.get().retrieve().bodyToMono(Gisgraphy.class).block();
    }

    public static List<Geofence> listGeofence() {
        String fooResourceUrl = "http://localhost:8082/api/geofences";
        UriComponents builder = UriComponentsBuilder.fromHttpUrl(fooResourceUrl).build();
        String uriString = builder.toUriString();
        WebClient webClient = WebClient.builder().baseUrl(uriString)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Basic eW9zbWVsbG9wZXpAZ21haWwuY29tOnNlbWVvbHZpZG8=")
                .build();
        return webClient.get().exchange().block().toEntityList(Geofence.class).block().getBody();
    }

    public static List<TraccarDevice> listDevices() {
        String fooResourceUrl = "http://localhost:8082/api/devices";
        UriComponents builder = UriComponentsBuilder.fromHttpUrl(fooResourceUrl).build();
        String uriString = builder.toUriString();
        WebClient webClient = WebClient.builder().baseUrl(uriString)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Basic eW9zbWVsbG9wZXpAZ21haWwuY29tOnNlbWVvbHZpZG8=")
                .build();
        return Objects.requireNonNull(webClient.get().exchange().doOnError(throwable -> System.out.println(throwable.getLocalizedMessage()))
                .block()).toEntityList(TraccarDevice.class).doOnError(throwable -> System.out.println(throwable.getLocalizedMessage())).block().getBody();
    }

    public static List<Device> listDevicesByUniqueId(Device device) {
        String fooResourceUrl = "http://localhost:8082/api/devices";
        UriComponents builder = UriComponentsBuilder.fromHttpUrl(fooResourceUrl).queryParam("uniqueId", device.getUniqueId()).build();
        String uriString = builder.toUriString();
        WebClient webClient = WebClient.builder().baseUrl(uriString)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Basic eW9zbWVsbG9wZXpAZ21haWwuY29tOnNlbWVvbHZpZG8=")
                .build();
        return webClient.get().exchange().doOnError(throwable -> System.out.println(throwable.getLocalizedMessage()))
                .block().toEntityList(Device.class).doOnError(throwable -> System.out.println(throwable.getLocalizedMessage())).block().getBody();
    }

    public static List<TraccarPosition> listPositions() {
        String fooResourceUrl = "http://localhost:8082/api/positions";
        UriComponents builder = UriComponentsBuilder.fromHttpUrl(fooResourceUrl).build();
        String uriString = builder.toUriString();
        WebClient webClient = WebClient.builder().baseUrl(uriString)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Basic eW9zbWVsbG9wZXpAZ21haWwuY29tOnNlbWVvbHZpZG8=")
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_UTF8_VALUE)
                .build();
        return webClient.get().exchange().block().toEntityList(TraccarPosition.class).block().getBody();
    }

    public static List<TraccarPosition> listPositionByDevice(Integer deviceId) {
        String fooResourceUrl = "http://localhost:8082/api/positions";
        UriComponents builder = UriComponentsBuilder.fromHttpUrl(fooResourceUrl).queryParam("deviceId", deviceId).build();
        String uriString = builder.toUriString();
        WebClient webClient = WebClient.builder().baseUrl(uriString)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Basic eW9zbWVsbG9wZXpAZ21haWwuY29tOnNlbWVvbHZpZG8=")
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_UTF8_VALUE)
                .build();
        return webClient.get().exchange().doOnError(throwable -> System.out.println(throwable.getLocalizedMessage())).block().toEntityList(TraccarPosition.class).block().getBody();
    }

    public static Geofence createGeoferenceByPlace(Place place) {
        String name = place.getName(), area = "CIRCLE (" + place.getLat() + " " + place.getLon() + ", 3000.0)", description = "Geocerca del area de " + place.getName();
        Geofence geofence = new Geofence(place.getId(), name, description, area);
        WebClient webClient = WebClient.create("http://localhost:8082");
        return webClient.post()
                .uri("/api/geofences")
                .body(BodyInserters.fromObject(geofence))
                .header(HttpHeaders.AUTHORIZATION, "Basic eW9zbWVsbG9wZXpAZ21haWwuY29tOnNlbWVvbHZpZG8=")
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .exchange().block()
                .bodyToMono(Geofence.class).block();
    }

    public static TraccarDevice createDevice(Device device) {
        TraccarDevice traccarDevice = new TraccarDevice(device);
        WebClient webClient = WebClient.create("http://localhost:8082");
        return webClient.post()
                .uri("/api/devices")
                .body(BodyInserters.fromObject(traccarDevice))
                .header(HttpHeaders.AUTHORIZATION, "Basic eW9zbWVsbG9wZXpAZ21haWwuY29tOnNlbWVvbHZpZG8=")
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .exchange().block()
                .bodyToMono(TraccarDevice.class).block();
    }

    public static TraccarDevice updateDevice(Device device) {
        TraccarDevice traccarDevice = new TraccarDevice(device);
        WebClient webClient = WebClient.create("http://localhost:8082");
        return webClient.put()
                .uri("/api/devices/{deviceId}", device.getTraccarDeviceId())
                .body(BodyInserters.fromValue(traccarDevice))
                .header(HttpHeaders.AUTHORIZATION, "Basic eW9zbWVsbG9wZXpAZ21haWwuY29tOnNlbWVvbHZpZG8=")
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .exchange().block()
                .bodyToMono(TraccarDevice.class).block();
    }
}
