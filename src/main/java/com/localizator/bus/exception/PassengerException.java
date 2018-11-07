package com.localizator.bus.exception;

import org.springframework.context.MessageSource;

import java.util.Locale;

public class PassengerException extends GeneralException {

    public PassengerException(Throwable cause, MessageSource messageSource, Locale locale) {
        super(cause, messageSource, locale);
    }

    @Override
    public String tratarExcepcion() {
        super.obtenerMensaje();
        if (mensaje.contains("unique_passenger_dni")) {
            int index = mensaje.lastIndexOf("dni");
            int finalIndex = mensaje.lastIndexOf(")");
            return messageSource.getMessage("unique_passenger_dni", null, locale) + mensaje.substring(index + 6, finalIndex);
        }
        return null;
    }
}
