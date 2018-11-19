package com.localizator.bus.exception;

import org.springframework.context.MessageSource;

import java.util.Locale;

public class CompanyException extends GeneralException {

    public CompanyException(Throwable cause, MessageSource messageSource, Locale locale) {
        super(cause, messageSource, locale);
    }

    @Override
    public String tratarExcepcion() {
        obtenerMensaje();
        return mensaje;
    }
}
