package com.localizator.bus.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

public class Attribute {

    @JsonInclude(value = JsonInclude.Include.NON_NULL)
    private Integer id;

    @JsonInclude(value = JsonInclude.Include.NON_NULL)
    private String description;

    @JsonInclude(value = JsonInclude.Include.NON_NULL)
    private String attribute;

    @JsonInclude(value = JsonInclude.Include.NON_NULL)
    private String expression;

    @JsonInclude(value = JsonInclude.Include.NON_NULL)
    private String type;

    public Attribute() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAttribute() {
        return attribute;
    }

    public void setAttribute(String attribute) {
        this.attribute = attribute;
    }

    public String getExpression() {
        return expression;
    }

    public void setExpression(String expression) {
        this.expression = expression;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
