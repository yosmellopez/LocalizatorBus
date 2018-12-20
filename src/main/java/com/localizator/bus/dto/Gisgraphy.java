package com.localizator.bus.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Gisgraphy {

    private GisgraphyResponseHeader responseHeader;

    private GisgraphyResponse response;

    public GisgraphyResponseHeader getResponseHeader() {
        return responseHeader;
    }

    public void setResponseHeader(GisgraphyResponseHeader responseHeader) {
        this.responseHeader = responseHeader;
    }

    public GisgraphyResponse getResponse() {
        return response;
    }

    public void setResponse(GisgraphyResponse response) {
        this.response = response;
    }
}
