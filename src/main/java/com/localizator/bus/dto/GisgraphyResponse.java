package com.localizator.bus.dto;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.HashSet;
import java.util.Set;

@JsonIgnoreProperties(ignoreUnknown = true)
public class GisgraphyResponse {

    private Integer numFound;

    private Integer start;

    private Float maxScore;

    @JsonProperty(value = "docs")
    private Set<Result> result = new HashSet<>();

    public Integer getNumFound() {
        return numFound;
    }

    public void setNumFound(Integer numFound) {
        this.numFound = numFound;
    }

    public Integer getStart() {
        return start;
    }

    public void setStart(Integer start) {
        this.start = start;
    }

    public Float getMaxScore() {
        return maxScore;
    }

    public void setMaxScore(Float maxScore) {
        this.maxScore = maxScore;
    }

    public Set<Result> getResult() {
        return result;
    }

    public void setResult(Set<Result> result) {
        this.result = result;
    }
}
