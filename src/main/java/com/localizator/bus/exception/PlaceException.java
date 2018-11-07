package com.localizator.bus.exception;

import org.springframework.context.MessageSource;

import java.util.Locale;

public class PlaceException extends GeneralException {

    public PlaceException(Throwable cause, MessageSource messageSource, Locale locale) {
        super(cause, messageSource, locale);
    }

    @Override
    public String tratarExcepcion() {
        super.obtenerMensaje();
        return null;
    }
}
