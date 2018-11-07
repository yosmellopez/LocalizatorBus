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


@RestController
@RequestMapping(value = "/api")
public class NotificationControl {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UsuarioNotificationRepository usuarioNotificationRepository;

    @Autowired
    private MessageSource messageSource;

    @Autowired
    private LocaleResolver localeResolver;

    @GetMapping(value = "/notification")
    public ResponseEntity<AppResponse<Notification>> listarNotifications(@AuthenticationPrincipal Usuario usuario) {
        List<UsuarioNotification> usuarioNotifications = usuarioNotificationRepository.findByUsuarioAndVisto(usuario, false);
        Set<Notification> notifications = usuarioNotifications.parallelStream().map(UsuarioNotification::getNotification).collect(Collectors.toSet());
        TreeSet<Notification> treeSet = new TreeSet<>(notifications);
        return ResponseEntity.ok(success(treeSet).total(treeSet.size()).build());
    }

    @GetMapping(value = "/notification/{idNotification}")
    public ResponseEntity<AppResponse<Notification>> findNotification(@PathVariable("idNotification") Optional<Notification> optional) {
        Notification notificationBd = optional.orElseThrow(() -> new EntityNotFoundException("notification_not_found"));
        return ResponseEntity.ok(success(notificationBd).build());
    }

    @PostMapping(value = "/notification")
    public ResponseEntity<AppResponse<Notification>> insertarNotification(@Valid @RequestBody Notification notification) {
        notificationRepository.saveAndFlush(notification);
        return ResponseEntity.ok(success(notification).build());
    }

    @PutMapping(value = "/notification/{idNotification}")
    public ResponseEntity<AppResponse<Notification>> actualizarNotification(@PathVariable("idNotification") Optional<Notification> optional, @AuthenticationPrincipal Usuario usuario) {
        Notification notificationBd = optional.orElseThrow(() -> new EntityNotFoundException("notification_not_found"));
        UsuarioNotificationPK notificationPK = new UsuarioNotificationPK(usuario.getId(), notificationBd.getId());
        UsuarioNotification usuarioNotification = usuarioNotificationRepository.findById(notificationPK).orElseThrow(() -> new EntityNotFoundException("user_notification_not_found"));
        usuarioNotification.setVisto(true);
        usuarioNotificationRepository.saveAndFlush(usuarioNotification);
        return ResponseEntity.ok(success(notificationBd).build());
    }

    @DeleteMapping(value = "/notification/{idNotification}")
    public ResponseEntity<AppResponse> eliminarNotification(@PathVariable("idNotification") Optional<Notification> optional, Locale locale) {
        Notification notification = optional.orElseThrow(() -> new EntityNotFoundException("notification_not_found"));
        notificationRepository.delete(notification);
        return ResponseEntity.ok(success(messageSource.getMessage("delete_notification", null, locale)).total(notificationRepository.count()).build());
    }

    @PostMapping(value = "/language/change")
    public ResponseEntity<AppResponse<Notification>> changeLanguage() {
        return ResponseEntity.ok(success().build());
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<AppResponse> tratarExcepciones(EntityNotFoundException e, Locale locale) {
        return ResponseEntity.ok(failure(messageSource.getMessage(e.getMessage(), null, locale)).build());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<AppResponse> tratarValidacion(MethodArgumentNotValidException ex, Locale locale) {
        List<FieldError> fieldErrors = ex.getBindingResult().getFieldErrors();
        String mensaje = fieldErrors.parallelStream().map(error -> messageSource.getMessage(error.getDefaultMessage(), null, locale)).collect(Collectors.joining(", "));
        return ResponseEntity.ok(failure(mensaje).build());
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<AppResponse> tratarValidacion(ConstraintViolationException ex, Locale locale) {
        Set<ConstraintViolation<?>> violations = ex.getConstraintViolations();
        String mensaje = violations.parallelStream().map(error -> messageSource.getMessage(error.getMessage(), null, locale)).collect(Collectors.joining(", "));
        return ResponseEntity.ok(failure(mensaje).build());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<AppResponse> tratarExcepcion(Exception e, Locale locale) {
        GeneralException exception = new NotificationException(e.getCause(), messageSource, locale);
        return ResponseEntity.ok(failure(exception.tratarExcepcion()).build());
    }
}
