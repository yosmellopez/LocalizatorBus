package com.localizator.bus.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;

public class Localization {

    @JsonProperty(value = "place_id")
    private Long placeId;

    @JsonProperty(value = "osm_id")
    private Long osmId;

    private Double lat;

    private Double lon;

    private String licence;

    @JsonProperty(value = "osm_type")
    private String osmType;

    @JsonProperty(value = "display_name")
    private String displayName;

    private Address address;

    private ArrayList<Double> boundingbox;

    public Long getPlaceId() {
        return placeId;
    }

    public void setPlaceId(Long placeId) {
        this.placeId = placeId;
    }

    public Long getOsmId() {
        return osmId;
    }

    public void setOsmId(Long osmId) {
        this.osmId = osmId;
    }

    public Double getLat() {
        return lat;
    }

    public void setLat(Double lat) {
        this.lat = lat;
    }

    public Double getLon() {
        return lon;
    }

    public void setLon(Double lon) {
        this.lon = lon;
    }

    public String getLicence() {
        return licence;
    }

    public void setLicence(String licence) {
        this.licence = licence;
    }

    public String getOsmType() {
        return osmType;
    }

    public void setOsmType(String osmType) {
        this.osmType = osmType;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public ArrayList<Double> getBoundingbox() {
        return boundingbox;
    }

    public void setBoundingbox(ArrayList<Double> boundingbox) {
        this.boundingbox = boundingbox;
    }
}
