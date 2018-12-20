package com.localizator.bus.service;

import com.localizator.bus.dto.Gisgraphy;
import com.localizator.bus.dto.Localization;
import org.springframework.http.*;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.nio.charset.Charset;


public class LocalizationService {

    public static Posicion getLocalizationByPlace(String place) {
        return new Posicion(50, 50);
    }

    public static Localization getLocalizationByCoord(Posicion posicion) {
        String fooResourceUrl = "https://nominatim.openstreetmap.org/reverse";
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(fooResourceUrl)
                .queryParam("format", "json")
                .queryParam("lat", posicion.getLatitud())
                .queryParam("lon", posicion.getLongitud())
                .queryParam("zoom", 18)
                .queryParam("addressdetails", 1);

        WebClient webClient = WebClient.builder().baseUrl(builder.toUriString())
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
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
}
