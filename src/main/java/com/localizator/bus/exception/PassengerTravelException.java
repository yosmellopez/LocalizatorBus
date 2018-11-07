package com.localizator.bus.exception;

import org.springframework.context.MessageSource;

import java.util.Locale;

public class PassengerTravelException extends GeneralException {

    public PassengerTravelException(Throwable cause, MessageSource messageSource, Locale locale) {
        super(cause, messageSource, locale);
    }

    @Override
    public String tratarExcepcion() {
        super.obtenerMensaje();
        if (mensaje.contains("fk_travel_passenger")) {
            return messageSource.getMessage("fk_travel_passenger", null, locale);
        }
        return null;
    }
}
