package com.localizator.bus.control;

import com.localizator.bus.dto.Geofence;
import com.localizator.bus.dto.Localization;
import com.localizator.bus.dto.Result;
import com.localizator.bus.entity.Place;
import com.localizator.bus.exception.GeneralException;
import com.localizator.bus.exception.PlaceException;
import com.localizator.bus.implement.ObservableGeofence;
import com.localizator.bus.repository.PlaceRepository;
import com.localizator.bus.service.LocalizationService;
import com.localizator.bus.service.Posicion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
public class PlaceControl {

    private final PlaceRepository placeRepository;

    private final MessageSource messageSource;

    @Autowired
    public PlaceControl(PlaceRepository placeRepository, MessageSource messageSource) {
        this.placeRepository = placeRepository;
        this.messageSource = messageSource;
    }

    @GetMapping(value = "/place")
    public ResponseEntity<AppResponse<Place>> listarPlaces(Pageable pageable) {
        Page<Place> places = placeRepository.findAll(pageable);
        return ok(success(places.getContent()).total(places.getTotalElements()).build());
    }

    @GetMapping(value = "/place/all")
    public ResponseEntity<AppResponse<Place>> listarAllPlaces() {
        List<Place> places = placeRepository.findAll();
        return ok(success(places).total(places.size()).build());
    }

    @GetMapping(value = "/place/autocomplete")
    public ResponseEntity<AppResponse<Place>> autocompletePlace(String query) {
        Set<Result> results = LocalizationService.getAutoComplete(query).getResponse().getResult();
        return ok(success(results).total(results.size()).build());
    }

    @GetMapping(value = "/place/findProperties")
    public ResponseEntity<AppResponse<Place>> findPlaceProperties(Double lat, Double lon) {
        Posicion posicion = new Posicion(lat, lon);
        Localization localization = LocalizationService.getLocalizationByCoord(posicion);
        return ok(success(localization).build());
    }

    @PostMapping(value = "/place")
    public ResponseEntity<AppResponse<Place>> insertarPlace(@Valid @RequestBody Place place) {
        placeRepository.saveAndFlush(place);
        Thread hilo = new Thread(new ObservableGeofence(place, placeRepository));
        hilo.start();
        return ok(success(place).build());
    }

    @PutMapping(value = "/place/{idPlace}")
    public ResponseEntity<AppResponse<Place>> actualizarPlace(@PathVariable("idPlace") Optional<Place> optional, @Valid @RequestBody Place place) {
        Place placeBd = optional.orElseThrow(() -> new EntityNotFoundException("place_not_found"));
        placeBd.clone(place);
        placeRepository.saveAndFlush(placeBd);
        return ok(success(placeBd).build());
    }

    @DeleteMapping(value = "/place/{idPlace}")
    public ResponseEntity<AppResponse> eliminarPlace(@PathVariable("idPlace") Optional<Place> optional, Locale locale) {
        Place place = optional.orElseThrow(() -> new EntityNotFoundException("place_not_found"));
        placeRepository.delete(place);
        return ok(success(messageSource.getMessage("delete_place", null, locale)).total(placeRepository.count()).build());
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
        GeneralException exception = new PlaceException(e.getCause(), messageSource, locale);
        return ok(failure(exception.tratarExcepcion()).build());
    }
}
