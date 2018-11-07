package com.localizator.bus.exception;

import org.springframework.context.MessageSource;

import java.util.Locale;

public class TravelException extends GeneralException {

    public TravelException(Throwable cause, MessageSource messageSource, Locale locale) {
        super(cause, messageSource, locale);
    }

    @Override
    public String tratarExcepcion() {
        super.obtenerMensaje();
//        fk_travel_bus
        if (mensaje.contains("fk_travel_bus")) {
            int index = mensaje.lastIndexOf("username");
            int finalIndex = mensaje.lastIndexOf(")");
            return messageSource.getMessage("unique_username", null, locale) + mensaje.substring(index + 11, finalIndex);
        } else if (mensaje.contains("fk_travel_passenger")) {
            return messageSource.getMessage("", null, locale);
        }
        return null;
    }
}
