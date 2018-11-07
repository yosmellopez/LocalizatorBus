package com.localizator.bus.control;

import com.localizator.bus.entity.Route;
import com.localizator.bus.exception.GeneralException;
import com.localizator.bus.exception.RouteException;
import com.localizator.bus.repository.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import javax.validation.Valid;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static com.localizator.bus.control.AppResponse.failure;
import static com.localizator.bus.control.AppResponse.success;


@RestController
@RequestMapping(value = "/api")
public class RouteControl {

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private MessageSource messageSource;

    @GetMapping(value = "/route")
    public ResponseEntity<AppResponse<Route>> listarRoutes(Pageable pageable) {
        Page<Route> routes = routeRepository.findAll(pageable);
        return ResponseEntity.ok(success(routes.getContent()).total(routes.getTotalElements()).build());
    }

    @GetMapping(value = "/route/all")
    public ResponseEntity<AppResponse<Route>> listarAllRoutes() {
        List<Route> routes = routeRepository.findAll();
        return ResponseEntity.ok(success(routes).total(routes.size()).build());
    }

    @GetMapping(value = "/route/{id}")
    public ResponseEntity<AppResponse<Route>> findOneRoute(@PathVariable("id") Optional<Route> optional) {
        Route route = optional.orElseThrow(() -> new EntityNotFoundException("route_not_found"));
        route.getPlaces().add(route.getDestiny());
        return ResponseEntity.ok(success(route).build());
    }

    @PostMapping(value = "/route")
    public ResponseEntity<AppResponse<Route>> insertarRoute(@Valid @RequestBody Route route) {
        routeRepository.saveAndFlush(route);
        return ResponseEntity.ok(success(route).build());
    }

    @PutMapping(value = "/route/{idRoute}")
    public ResponseEntity<AppResponse<Route>> actualizarRoute(@PathVariable("idRoute") Optional<Route> optional, @RequestBody Route route) {
        Route routeBd = optional.orElseThrow(() -> new EntityNotFoundException("route_not_found"));
//        routeBd.clonarDatos(route);
        routeRepository.saveAndFlush(routeBd);
        return ResponseEntity.ok(success(routeBd).build());
    }

    @DeleteMapping(value = "/route/{idRoute}")
    public ResponseEntity<AppResponse> eliminarRoute(@PathVariable("idRoute") Optional<Route> optional) {
        Route route = optional.orElseThrow(() -> new EntityNotFoundException("route_not_found"));
        routeRepository.delete(route);
        return ResponseEntity.ok(success("Route eliminado correctamente").total(routeRepository.count()).build());
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
        GeneralException exception = new RouteException(e.getCause(), messageSource, locale);
        return ResponseEntity.ok(failure(exception.tratarExcepcion()).build());
    }
}
