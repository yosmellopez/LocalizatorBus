package com.localizator.bus.exception;

import org.hibernate.exception.SQLGrammarException;
import org.springframework.context.MessageSource;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.orm.jpa.JpaSystemException;

import javax.persistence.PersistenceException;
import java.util.Locale;

public abstract class GeneralException extends Exception {

    protected String mensaje;

    protected MessageSource messageSource;

    protected Locale locale;

    public GeneralException(String message) {
        super(message);
        this.mensaje = message;
    }

    public GeneralException(Throwable cause, MessageSource messageSource, Locale locale) {
        super(cause);
        this.messageSource = messageSource;
        this.locale = locale;
    }

    public void obtenerMensaje() {
        Throwable e = getCause();
        if (e instanceof JpaSystemException) {
            JpaSystemException jse = (JpaSystemException) e;
            mensaje = jse.getMostSpecificCause().getLocalizedMessage();
        } else if (e instanceof PersistenceException) {
            JpaSystemException exception = new JpaSystemException((PersistenceException) e);
            mensaje = exception.getMostSpecificCause().getLocalizedMessage();
        } else if (e instanceof DataIntegrityViolationException) {
            DataIntegrityViolationException exception = (DataIntegrityViolationException) e;
            mensaje = exception.getMostSpecificCause().getLocalizedMessage();
        } else if (e instanceof SQLGrammarException) {
            SQLGrammarException exception = (SQLGrammarException) e;
            mensaje = exception.getCause().getLocalizedMessage();
        } else {
            mensaje = e.getLocalizedMessage();
        }
    }

    public abstract String tratarExcepcion();

}
