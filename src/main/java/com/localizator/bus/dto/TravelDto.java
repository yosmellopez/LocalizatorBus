package com.localizator.bus.dto;

import com.localizator.bus.entity.Travel;

public class TravelDto {

    private Long id;

    public TravelDto(Travel travel) {
        this.id = travel.getId();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
