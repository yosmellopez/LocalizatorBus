package com.localizator.bus.json;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class TimeDeserializer extends JsonDeserializer<Date> {

    @Override
    public Date deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException, JsonProcessingException {
        SimpleDateFormat dateFormat = new SimpleDateFormat("hh:mm aaa");
        try {
            System.out.println(jsonParser.getText());
            return dateFormat.parse(jsonParser.getText());
        } catch (ParseException e) {
            return new Date();
        }
    }
}
