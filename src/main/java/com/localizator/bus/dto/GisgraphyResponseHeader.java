package com.localizator.bus.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class GisgraphyResponseHeader {

    private Integer status;

    @JsonProperty(value = "QTime")
    private Integer qTime;

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Integer getqTime() {
        return qTime;
    }

    public void setqTime(Integer qTime) {
        this.qTime = qTime;
    }
}
