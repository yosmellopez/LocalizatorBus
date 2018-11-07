package com.localizator.bus.exception;

import org.springframework.context.MessageSource;

import java.util.Locale;

public class NotificationException extends GeneralException {

    public NotificationException(Throwable cause, MessageSource messageSource, Locale locale) {
        super(cause, messageSource, locale);
    }

    @Override
    public String tratarExcepcion() {
        return null;
    }
}
