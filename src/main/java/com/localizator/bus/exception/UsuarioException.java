package com.localizator.bus.exception;

import org.springframework.context.MessageSource;

import java.util.Locale;

public class UsuarioException extends GeneralException {

    public UsuarioException(String message) {
        super(message);
    }

    public UsuarioException(Throwable cause, MessageSource messageSource, Locale locale) {
        super(cause, messageSource, locale);
    }

    @Override
    public String tratarExcepcion() {
        super.obtenerMensaje();
        if (mensaje.contains("unique_username")) {
            int index = mensaje.lastIndexOf("username");
            int finalIndex = mensaje.lastIndexOf(")");
            return messageSource.getMessage("unique_username", null, locale) + mensaje.substring(index + 11, finalIndex);
        }
        return null;
    }
}
