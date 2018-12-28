package com.localizator.bus.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.localizator.bus.entity.Device;

import java.util.ArrayList;

public class TraccarDevice {

    @JsonProperty(value = "id")
    private Long deviceId;

    private Long uniqueId;

    private String name;

    private String status;

    private Boolean disabled;
//    lastUpdate: string (date-time)
//    in IS0 8601 format. eg. 1963-11-22T18:30:00Z

    private Integer positionId;

    private Integer groupId;

    private String phone;

    private String model;

    private String contact;

    private String category;

    @JsonInclude(value = JsonInclude.Include.NON_NULL)
    private ArrayList<Integer> geofenceIds = new ArrayList<>();

    public TraccarDevice() {
    }

    public TraccarDevice(Device device) {
        deviceId = device.getTraccarDeviceId();
        uniqueId = device.getUniqueId();
        name = device.getName();
        status = device.getStatus();
        disabled = device.getDisabled();
        positionId = device.getPositionId();
        groupId = device.getGroupId();
        phone = device.getPhone();
        model = device.getModel();
        contact = device.getContact();
        category = device.getCategory();
        geofenceIds = device.getGeofenceIds();
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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
}
