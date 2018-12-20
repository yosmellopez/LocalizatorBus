package com.localizator.bus.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.Objects;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Result {

    @JsonProperty(value = "feature_id")
    private Long featureId;

    private String name;

    private String label;

    @JsonProperty(value = "fully_qualified_name")
    private String fullyQualifiedName;

    private Double lat;

    private Double lng;

    @JsonProperty(value = "lat_admin_centre")
    private Double latAdminCentre;

    @JsonProperty(value = "lng_admin_centre")
    private Double lngAdminCentre;

    private String placetype;

    @JsonProperty(value = "country_code")
    private String countryCode;

    private Boolean municipality;

    @JsonProperty(value = "feature_class")
    private String featureClass;

    @JsonProperty(value = "feature_code")
    private String featureCode;

    @JsonProperty(value = "name_ascii")
    private String nameAscii;

    private Integer gtopo30;

    private String timezone;

    private String amenity;

    private Long population;

    @JsonProperty(value = "country_name")
    private String countryName;

    private Float score;

    private ArrayList<String> zipcode = new ArrayList<>();

    public Long getFeatureId() {
        return featureId;
    }

    public void setFeatureId(Long featureId) {
        this.featureId = featureId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getFullyQualifiedName() {
        return fullyQualifiedName;
    }

    public void setFullyQualifiedName(String fullyQualifiedName) {
        this.fullyQualifiedName = fullyQualifiedName;
    }

    public Double getLat() {
        return lat;
    }

    public void setLat(Double lat) {
        this.lat = lat;
    }

    public Double getLng() {
        return lng;
    }

    public void setLng(Double lng) {
        this.lng = lng;
    }

    public Double getLatAdminCentre() {
        return latAdminCentre;
    }

    public void setLatAdminCentre(Double latAdminCentre) {
        this.latAdminCentre = latAdminCentre;
    }

    public Double getLngAdminCentre() {
        return lngAdminCentre;
    }

    public void setLngAdminCentre(Double lngAdminCentre) {
        this.lngAdminCentre = lngAdminCentre;
    }

    public String getPlacetype() {
        return placetype;
    }

    public void setPlacetype(String placetype) {
        this.placetype = placetype;
    }

    public String getCountryCode() {
        return countryCode.toLowerCase();
    }

    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
    }


    public String getFeatureClass() {
        return featureClass;
    }

    public void setFeatureClass(String featureClass) {
        this.featureClass = featureClass;
    }

    public String getFeatureCode() {
        return featureCode;
    }

    public void setFeatureCode(String featureCode) {
        this.featureCode = featureCode;
    }

    public String getNameAscii() {
        return nameAscii;
    }

    public void setNameAscii(String nameAscii) {
        this.nameAscii = nameAscii;
    }

    public Integer getGtopo30() {
        return gtopo30;
    }

    public void setGtopo30(Integer gtopo30) {
        this.gtopo30 = gtopo30;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public Long getPopulation() {
        return population;
    }

    public void setPopulation(Long population) {
        this.population = population;
    }

    public String getCountryName() {
        return countryName;
    }

    public void setCountryName(String countryName) {
        this.countryName = countryName;
    }

    public Float getScore() {
        return score;
    }

    public void setScore(Float score) {
        this.score = score;
    }

    public Boolean getMunicipality() {
        return municipality;
    }

    public void setMunicipality(Boolean municipality) {
        this.municipality = municipality;
    }

    public String getAmenity() {
        return amenity;
    }

    public void setAmenity(String amenity) {
        this.amenity = amenity;
    }

    public ArrayList<String> getZipcode() {
        return zipcode;
    }

    public void setZipcode(ArrayList<String> zipcode) {
        this.zipcode = zipcode;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Result result = (Result) o;
        return Objects.equals(name, result.name) &&
                Objects.equals(placetype, result.placetype) &&
                Objects.equals(countryName, result.countryName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, placetype, countryName);
    }

    @Override
    public String toString() {
        return "Result{" + "name='" + name + '\'' + ", label='" + label + '\'' + ", lat=" + lat + ", lng=" + lng + ", placetype='" + placetype + '\'' +
                ", countryCode='" + countryCode + '\'' + ", municipality=" + municipality + ", timezone='" + timezone + '\'' + ", amenity='" + amenity + '\'' +
                ", population=" + population + ", countryName='" + countryName + '\'' + '}';
    }
}
