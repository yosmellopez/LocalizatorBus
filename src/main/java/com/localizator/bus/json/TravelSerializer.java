package com.localizator.bus.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.localizator.bus.dto.TravelDto;
import com.localizator.bus.entity.Travel;

import java.io.IOException;

public class TravelSerializer extends JsonSerializer<Travel> {

    @Override
    public void serialize(Travel travel, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        jsonGenerator.writeObject(new TravelDto(travel));
    }
}
