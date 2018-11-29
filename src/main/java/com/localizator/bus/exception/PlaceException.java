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
        if (mensaje.contains("fk_place_origin_route")) {
            return messageSource.getMessage("router_place_origin_delete", null, locale);
        } else if (mensaje.contains("fk_place_destiny_route")) {
            return messageSource.getMessage("router_place_destiny_delete", null, locale);
        } else if (mensaje.contains("place_name_unique")) {
            int index = mensaje.lastIndexOf("name");
            int finalIndex = mensaje.lastIndexOf(")");
            return messageSource.getMessage("unique_place_name", new Object[]{mensaje.substring(index + 7, finalIndex)}, locale);
        }
        return mensaje;
    }
}
