package com.localizator.bus.exception;

import org.springframework.context.MessageSource;

import java.util.Locale;

public class RouteException extends GeneralException {

    public RouteException(Throwable cause, MessageSource messageSource, Locale locale) {
        super(cause, messageSource, locale);
    }

    @Override
    public String tratarExcepcion() {
        super.obtenerMensaje();
        if (mensaje.contains("unique_route_origin_destiny")) {
            return messageSource.getMessage("unique_route_origin_destiny", null, locale);
        } else if (mensaje.contains("unique_route_code")) {
            return messageSource.getMessage("unique_route_code", null, locale);
        } else if (mensaje.contains("fk_travel_route")) {
            return messageSource.getMessage("router_travel_delete", null, locale);
        }
        return null;
    }
}
