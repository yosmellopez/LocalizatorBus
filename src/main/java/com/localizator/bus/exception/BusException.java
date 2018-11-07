package com.localizator.bus.exception;

import org.springframework.context.MessageSource;

import java.util.Locale;

public class BusException extends GeneralException {

    public BusException(Throwable cause, MessageSource messageSource, Locale locale) {
        super(cause, messageSource, locale);
    }

    @Override
    public String tratarExcepcion() {
        super.obtenerMensaje();
        if (mensaje.contains("unique_bus_code")) {
            int index = mensaje.lastIndexOf("code");
            int finalIndex = mensaje.lastIndexOf(")");
            return messageSource.getMessage("unique_bus_code", null, locale) + " " + mensaje.substring(index + 7, finalIndex);
        } else if (mensaje.contains("unique_bus_number")) {
            int index = mensaje.lastIndexOf("number");
            int finalIndex = mensaje.lastIndexOf(")");
            return messageSource.getMessage("unique_bus_number", null, locale) + " " + mensaje.substring(index + 9, finalIndex);
        } else if (mensaje.contains("fk_travel_bus")) {
            return messageSource.getMessage("fk_travel_bus", null, locale);
        }
        return null;
    }
}
