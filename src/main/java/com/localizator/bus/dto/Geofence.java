package com.localizator.bus.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

public class Geofence {

    @JsonInclude(value = JsonInclude.Include.NON_NULL)
    private Long id;

    private String name;

    private String description;

    private String area;

    private Integer calendarId;

    @JsonInclude(value = JsonInclude.Include.NON_NULL)
    private Attribute attributes;

    public Geofence() {
    }

    public Geofence(Long id, String name, String description, String area) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.area = area;
        calendarId = 0;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public Integer getCalendarId() {
        return calendarId;
    }

    public void setCalendarId(Integer calendarId) {
        this.calendarId = calendarId;
    }

    public Attribute getAttributes() {
        return attributes;
    }

    public void setAttributes(Attribute attributes) {
        this.attributes = attributes;
    }

    @Override
    public String toString() {
        return "Geofence{" + "id=" + id + ", name='" + name + '\'' + ", description='" + description + '\'' + ", area='" + area + '\'' + ", calendarId=" + calendarId + '}';
    }
}
