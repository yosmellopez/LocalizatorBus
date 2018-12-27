package com.localizator.bus.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.ArrayList;

@Entity
@Table(name = "device", uniqueConstraints = {@UniqueConstraint(name = "device_unique_id", columnNames = {"unique_id"})})
@JsonIgnoreProperties(ignoreUnknown = true)
public class Device implements Serializable, ClonableEntity<Device> {

    @Id
    @Column(name = "device_id")
    @JsonProperty(value = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long deviceId;

    @Column(name = "unique_id")
    @NotNull(message = "device_traccar_id_not_null")
    private Long uniqueId;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "total_distance")
    private Integer totalDistance;

    @Column(name = "hours")
    private Integer hours;

    @NotNull(message = "device_name_not_null")
    private String name;

    private String status;

    private Boolean disabled;
//    lastUpdate: string (date-time)
//    in IS0 8601 format. eg. 1963-11-22T18:30:00Z

    @Column(name = "position_id")
    private Integer positionId;

    @Column(name = "group_id")
    private Integer groupId;

    private String phone;

    private String model;

    private String contact;

    private String category;

    private ArrayList<Integer> geofenceIds = new ArrayList<>();

    public Device() {
    }

    public Long getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(Long deviceId) {
        this.deviceId = deviceId;
    }

    public Long getUniqueId() {
        return uniqueId;
    }

    public void setUniqueId(Long uniqueId) {
        this.uniqueId = uniqueId;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Integer getTotalDistance() {
        return totalDistance;
    }

    public void setTotalDistance(Integer totalDistance) {
        this.totalDistance = totalDistance;
    }

    public Integer getHours() {
        return hours;
    }

    public void setHours(Integer hours) {
        this.hours = hours;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getDisabled() {
        return disabled;
    }

    public void setDisabled(Boolean disabled) {
        this.disabled = disabled;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getPositionId() {
        return positionId;
    }

    public void setPositionId(Integer positionId) {
        this.positionId = positionId;
    }

    public Integer getGroupId() {
        return groupId;
    }

    public void setGroupId(Integer groupId) {
        this.groupId = groupId;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public ArrayList<Integer> getGeofenceIds() {
        return geofenceIds;
    }

    public void setGeofenceIds(ArrayList<Integer> geofenceIds) {
        this.geofenceIds = geofenceIds;
    }

    @Override
    public String toString() {
        return "Device{" + "deviceId=" + deviceId + ", latitude=" + latitude + ", longitude=" + longitude + '}';
    }

    @Override
    public void clone(Device device) {
        category = device.category;
        contact = device.contact;
        model = device.model;
        phone = device.phone;
        status = device.status;
        name = device.name;
        uniqueId = device.uniqueId;
        groupId = device.groupId;
        positionId = device.positionId;
        hours = device.hours;
        totalDistance = device.totalDistance;
        disabled = device.disabled;
        geofenceIds = device.geofenceIds;
        latitude = device.latitude;
        longitude = device.longitude;
    }
}
