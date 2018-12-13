package com.localizator.bus.control;

import com.localizator.bus.entity.Notification;
import com.localizator.bus.entity.Usuario;
import com.localizator.bus.entity.UsuarioNotification;
import com.localizator.bus.entity.UsuarioNotificationPK;
import com.localizator.bus.exception.GeneralException;
import com.localizator.bus.exception.NotificationException;
import com.localizator.bus.repository.NotificationRepository;
import com.localizator.bus.repository.UsuarioNotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.LocaleResolver;

import javax.persistence.EntityNotFoundException;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import javax.validation.Valid;
import java.util.*;
import java.util.stream.Collectors;

import static com.localizator.bus.control.AppResponse.failure;
import static com.localizator.bus.control.AppResponse.success;
import static org.springframework.http.ResponseEntity.ok;


@RestController
@RequestMapping(value = "/api")
public class NotificationControl {

    private final NotificationRepository notificationRepository;

    private final UsuarioNotificationRepository usuarioNotificationRepository;

    private final MessageSource messageSource;

    @Autowired
    public NotificationControl(NotificationRepository notificationRepository, UsuarioNotificationRepository usuarioNotificationRepository, MessageSource messageSource) {
        this.notificationRepository = notificationRepository;
        this.usuarioNotificationRepository = usuarioNotificationRepository;
        this.messageSource = messageSource;
    }

    @GetMapping(value = "/notification")
    public ResponseEntity<AppResponse<Notification>> listarNotifications(Pageable pageable, @AuthenticationPrincipal Usuario usuario) {
        Page<UsuarioNotification> page = usuarioNotificationRepository.findByUsuarioAndVisto(usuario, false, pageable);
        List<UsuarioNotification> usuarioNotifications = page.getContent();
        Set<Notification> notifications = usuarioNotifications.parallelStream().map(UsuarioNotification::getNotification).collect(Collectors.toSet());
        TreeSet<Notification> treeSet = new TreeSet<>(notifications);
        return ok(success(treeSet).total(page.getTotalElements()).build());
    }

    @GetMapping(value = "/notification/{idNotification}")
    public ResponseEntity<AppResponse<Notification>> findNotification(@PathVariable("idNotification") Optional<Notification> optional) {
        Notification notificationBd = optional.orElseThrow(() -> new EntityNotFoundException("notification_not_found"));
        return ok(success(notificationBd).build());
    }

    @PostMapping(value = "/notification")
    public ResponseEntity<AppResponse<Notification>> insertarNotification(@Valid @RequestBody Notification notification) {
        notificationRepository.saveAndFlush(notification);
        return ok(success(notification).build());
    }

    @PutMapping(value = "/notification/{idNotification}")
    public ResponseEntity<AppResponse<Notification>> actualizarNotification(@PathVariable("idNotification") Optional<Notification> optional, @AuthenticationPrincipal Usuario usuario) {
        Notification notificationBd = optional.orElseThrow(() -> new EntityNotFoundException("notification_not_found"));
        UsuarioNotificationPK notificationPK = new UsuarioNotificationPK(usuario.getId(), notificationBd.getId());
        UsuarioNotification usuarioNotification = usuarioNotificationRepository.findById(notificationPK).orElseThrow(() -> new EntityNotFoundException("user_notification_not_found"));
        usuarioNotification.setVisto(true);
        usuarioNotificationRepository.saveAndFlush(usuarioNotification);
        return ok(success(notificationBd).build());
    }

    @DeleteMapping(value = "/notification/{idNotification}")
    public ResponseEntity<AppResponse> eliminarNotification(@PathVariable("idNotification") Optional<Notification> optional, Locale locale) {
        Notification notification = optional.orElseThrow(() -> new EntityNotFoundException("notification_not_found"));
        notificationRepository.delete(notification);
        return ok(success(messageSource.getMessage("delete_notification", null, locale)).total(notificationRepository.count()).build());
    }

    @DeleteMapping(value = "/notification/readAll")
    public ResponseEntity<AppResponse> readAll(@AuthenticationPrincipal Usuario usuario, Locale locale) {
        List<UsuarioNotification> notifications = usuarioNotificationRepository.findByUsuarioAndVisto(usuario, false);
        for (UsuarioNotification notification : notifications) {
            notification.setVisto(true);
            usuarioNotificationRepository.save(notification);
        }
        usuarioNotificationRepository.flush();
        return ok(success(messageSource.getMessage("notification_read_all", null, locale)).total(notificationRepository.count()).build());
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<AppResponse> tratarExcepciones(EntityNotFoundException e, Locale locale) {
        return ok(failure(messageSource.getMessage(e.getMessage(), null, locale)).build());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<AppResponse> tratarValidacion(MethodArgumentNotValidException ex, Locale locale) {
        List<FieldError> fieldErrors = ex.getBindingResult().getFieldErrors();
        String mensaje = fieldErrors.parallelStream().map(error -> messageSource.getMessage(error.getDefaultMessage(), null, locale)).collect(Collectors.joining(", "));
        return ok(failure(mensaje).build());
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<AppResponse> tratarValidacion(ConstraintViolationException ex, Locale locale) {
        Set<ConstraintViolation<?>> violations = ex.getConstraintViolations();
        String mensaje = violations.parallelStream().map(error -> messageSource.getMessage(error.getMessage(), null, locale)).collect(Collectors.joining(", "));
        return ok(failure(mensaje).build());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<AppResponse> tratarExcepcion(Exception e, Locale locale) {
        GeneralException exception = new NotificationException(e.getCause(), messageSource, locale);
        return ok(failure(exception.tratarExcepcion()).build());
    }
}
