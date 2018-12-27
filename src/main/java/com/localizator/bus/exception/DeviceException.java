package com.localizator.bus.exception;

import org.springframework.context.MessageSource;

import java.util.Locale;

public class DeviceException extends GeneralException {

    public DeviceException(Throwable cause, MessageSource messageSource, Locale locale) {
        super(cause, messageSource, locale);
    }

    @Override
    public String tratarExcepcion() {
        return null;
    }
}
