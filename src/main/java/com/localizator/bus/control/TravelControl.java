package com.localizator.bus.control;

import com.localizator.bus.entity.*;
import com.localizator.bus.exception.TravelException;
import com.localizator.bus.exception.GeneralException;
import com.localizator.bus.repository.NotificationRepository;
import com.localizator.bus.repository.TravelRepository;
import com.localizator.bus.repository.UsuarioNotificationRepository;
import com.localizator.bus.repository.UsuarioRepository;
import com.localizator.bus.security.SecurityUtils;
import com.localizator.bus.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

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
public class TravelControl {

    @Autowired
    private TravelRepository travelRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private MessageSource messageSource;

    @GetMapping(value = "/travel")
    public ResponseEntity<AppResponse<Travel>> listarTravels(Pageable pageable, @AuthenticationPrincipal Usuario usuario) {
        if (SecurityUtils.isAdmin()) {
            Page<Travel> travels = travelRepository.findAll(pageable);
            return ok(success(travels.getContent()).total(travels.getTotalElements()).build());
        } else {
            Company company = usuario.getCompanies().parallelStream().findFirst().get();
            Page<Travel> page = travelRepository.findByBus_Company(company, pageable);
            return ok(success(page.getContent()).total(page.getTotalElements()).build());
        }
    }

    @PostMapping(value = "/travel")
    public ResponseEntity<AppResponse<Travel>> insertarTravel(@Valid @RequestBody Travel travel, @AuthenticationPrincipal Usuario usuario, Locale locale) {
        travelRepository.saveAndFlush(travel);
        String mensaje = messageSource.getMessage("travel_added", null, locale);
        createNotifications(travel, usuario);
        return ok(success(travel).msg(mensaje).build());
    }

    @PutMapping(value = "/travel/{idTravel}")
    public ResponseEntity<AppResponse<Travel>> actualizarTravel(@PathVariable("idTravel") Optional<Travel> optional, @RequestBody Travel travel, Locale locale) {
        Travel travelBd = optional.orElseThrow(() -> new EntityNotFoundException("travel_not_found"));
        travelBd.clone(travel);
        travelRepository.saveAndFlush(travelBd);
        String mensaje = messageSource.getMessage("travel_successfull_updated", null, locale);
        return ok(success(travelBd).msg(mensaje).build());
    }

    @PutMapping(value = "/travel/finalize/{idTravel}")
    public ResponseEntity<AppResponse> finalizeTravel(@PathVariable("idTravel") Optional<Travel> optional, Locale locale) {
        Travel travelBd = optional.orElseThrow(() -> new EntityNotFoundException("travel_not_found"));
        List<PassengerTravel> passengerTravels = travelBd.getPassengerTravels();
        if (passengerTravels.isEmpty()) {
            travelRepository.delete(travelBd);
            return ok(failure(messageSource.getMessage("travel_passengers_empty", null, locale)).build());
        }
        travelRepository.saveAndFlush(travelBd);
        String mensaje = messageSource.getMessage("travel_successfull_added", null, locale);
        return ok(success(travelBd).msg(mensaje).build());
    }

    @DeleteMapping(value = "/travel/{idTravel}")
    public ResponseEntity<AppResponse> eliminarTravel(@PathVariable("idTravel") Optional<Travel> optional, Locale locale) {
        Travel travel = optional.orElseThrow(() -> new EntityNotFoundException("travel_not_found"));
        travelRepository.delete(travel);
        return ok(success(messageSource.getMessage("travel_deleted", null, locale)).total(travelRepository.count()).build());
    }

    private void createNotifications(Travel travel, Usuario usuario) {
        Route route = travel.getRoute();
        String descripcion = "El viaje de " + route.getOrigin().getName() + " a " + route.getDestiny().getName() + " con el bus " +
                travel.getBus().getCode() + " ha sido insertado satisfactoriamente.";
        Notification notification = new Notification("Nuevo viaje insertado", descripcion, new Date());
        notification.setIcono("airplanemode_active");
        notificationService.createNotificacion(notification, usuario, true);
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
        GeneralException exception = new TravelException(e.getCause(), messageSource, locale);
        return ok(failure(exception.tratarExcepcion()).build());
    }
}
