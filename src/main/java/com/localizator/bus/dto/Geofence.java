package com.localizator.bus.dto;

public class Geofence {

    private Integer id;

    private String name;

    private String description;

    private String area;

    private Integer calendarId;

    private Attribute attributes;

    public Geofence() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
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
