package com.localizator.bus.control;

import com.localizator.bus.entity.Passenger;
import com.localizator.bus.exception.GeneralException;
import com.localizator.bus.exception.PassengerException;
import com.localizator.bus.repository.PassengerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
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
import static org.springframework.http.ResponseEntity.ok;


@RestController
@RequestMapping(value = "/api")
public class PassengerControl {

    private final PassengerRepository passengerRepository;

    private final MessageSource messageSource;

    @Autowired
    public PassengerControl(PassengerRepository passengerRepository, MessageSource messageSource) {
        this.passengerRepository = passengerRepository;
        this.messageSource = messageSource;
    }

    @GetMapping(value = "/passenger")
    public ResponseEntity<AppResponse<Passenger>> listarPassengers() {
        List<Passenger> passengers = passengerRepository.findAll();
        return ok(success(passengers).total(passengers.size()).build());
    }

    @GetMapping(value = "/passenger/all")
    public ResponseEntity<AppResponse<Passenger>> listarAllPassengers() {
        List<Passenger> passengers = passengerRepository.findAll();
        return ok(success(passengers).total(passengers.size()).build());
    }

    @GetMapping(value = "/passenger/find")
    public ResponseEntity<AppResponse<Passenger>> findPassengers(String dni) {
        Optional<Passenger> optional = passengerRepository.findByDni(dni);
        Passenger passenger = optional.orElseThrow(() -> new EntityNotFoundException("passenger_not_found"));
        return ok(success(passenger).build());
    }

    @PostMapping(value = "/passenger")
    public ResponseEntity<AppResponse<Passenger>> insertarPassenger(@Valid @RequestBody Passenger passenger) {
        Optional<Passenger> optional = passengerRepository.findByDni(passenger.getDni());
        if (optional.isPresent()) {
            return ok(success(optional.get()).build());
        }
        passengerRepository.saveAndFlush(passenger);
        return ok(success(passenger).build());
    }

    @PutMapping(value = "/passenger/{idPassenger}")
    public ResponseEntity<AppResponse<Passenger>> actualizarPassenger(@PathVariable("idPassenger") Optional<Passenger> optional, @RequestBody Passenger passenger) {
        Passenger passengerBd = optional.orElseThrow(() -> new EntityNotFoundException("passenger_not_found"));
        passengerBd.clone(passenger);
        passengerRepository.saveAndFlush(passengerBd);
        return ok(success(passengerBd).build());
    }

    @DeleteMapping(value = "/passenger/{idPassenger}")
    public ResponseEntity<AppResponse> eliminarPassenger(@PathVariable("idPassenger") Optional<Passenger> optional, Locale locale) {
        Passenger passenger = optional.orElseThrow(() -> new EntityNotFoundException("passenger_not_found"));
        passengerRepository.delete(passenger);
        return ok(success(messageSource.getMessage("delete_passenger", null, locale))
                .total(passengerRepository.count()).build());
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
        GeneralException exception = new PassengerException(e.getCause(), messageSource, locale);
        return ok(failure(exception.tratarExcepcion()).build());
    }
}
