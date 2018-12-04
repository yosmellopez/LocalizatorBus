package com.localizator.bus.control;

import com.localizator.bus.AppConstants;
import com.localizator.bus.entity.*;
import com.localizator.bus.exception.GeneralException;
import com.localizator.bus.exception.PassengerTravelException;
import com.localizator.bus.repository.PassengerTravelRepository;
import com.localizator.bus.repository.RouteRepository;
import com.localizator.bus.repository.TravelRepository;
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
public class PassengerTravelControl {

    @Autowired
    private PassengerTravelRepository passengerTravelRepository;

    @Autowired
    private TravelRepository travelRepository;

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private MessageSource messageSource;

    @GetMapping(value = "/passengerTravel")
    public ResponseEntity<AppResponse<PassengerTravel>> listarPassengerTravelPlaces() {
        List<PassengerTravel> passengerTravels = passengerTravelRepository.findAll();
        return ok(success(passengerTravels).total(passengerTravels.size()).build());
    }

    @PostMapping(value = "/passengerTravel")
    public ResponseEntity<AppResponse<PassengerTravel>> insertarPassengerTravel(@Valid @RequestBody PassengerTravel passengerTravel, Locale locale) {
        Travel travel = travelRepository.findById(passengerTravel.getTravel().getId()).orElseThrow(() -> new EntityNotFoundException("travel_not_found"));
        Route route = routeRepository.findById(travel.getRoute().getId()).orElseThrow(() -> new EntityNotFoundException("route_not_found"));
        Place place = passengerTravel.getPlace();
        if (!place.equals(route.getDestiny()) && !route.getPlaces().contains(place)) {
            return ok(failure(messageSource.getMessage("passenger_place_not_match", null, locale)).build());
        }
        Passenger passenger = passengerTravel.getPassenger();
        PassengerTravelPK passengerTravelPK = new PassengerTravelPK(passenger.getId(), passengerTravel.getTravel().getId());
        boolean exists = passengerTravelRepository.existsById(passengerTravelPK);
        if (exists) {
            return ok(failure(messageSource.getMessage("passenger_travel_exist", new Object[]{passenger.getName(), passenger.getLastname()}, locale)).build());
        }
        passengerTravel.setPassengerTravelPK(passengerTravelPK);
        passengerTravelRepository.saveAndFlush(passengerTravel);
        return ok(success(passengerTravel).build());
    }

    @PutMapping(value = "/passengerTravel/{optPassenger}/{optTravel}")
    public ResponseEntity<AppResponse<PassengerTravel>> modificar(@PathVariable Optional<Passenger> optPassenger, @PathVariable Optional<Travel> optTravel, @RequestBody PassengerTravel passengerTravel) {
        Passenger passenger = optPassenger.orElseThrow(() -> new EntityNotFoundException("passenger_not_found"));
        Travel travel = optTravel.orElseThrow(() -> new EntityNotFoundException("travel_not_found"));
        PassengerTravelPK passengerTravelPK = new PassengerTravelPK(passenger.getId(), travel.getId());
        Optional<PassengerTravel> optional = passengerTravelRepository.findById(passengerTravelPK);
        PassengerTravel passengerTravelBd = optional.orElseThrow(() -> new EntityNotFoundException("passenger_travel_not_found"));
        passengerTravelBd.clone(passengerTravel);
        passengerTravelRepository.saveAndFlush(passengerTravelBd);
        return ok(success(passengerTravelBd).build());
    }

    @DeleteMapping(value = "/passengerTravel/{optPassenger}/{optTravel}")
    public ResponseEntity<AppResponse> eliminarPassengerTravel(@PathVariable Optional<Passenger> optPassenger, @PathVariable Optional<Travel> optTravel) {
        Passenger passenger = optPassenger.orElseThrow(() -> new EntityNotFoundException("passenger_not_found"));
        Travel travel = optTravel.orElseThrow(() -> new EntityNotFoundException("travel_not_found"));
        PassengerTravelPK passengerTravelPlacePK = new PassengerTravelPK(passenger.getId(), travel.getId());
        Optional<PassengerTravel> optional = passengerTravelRepository.findById(passengerTravelPlacePK);
        PassengerTravel passengerTravel = optional.orElseThrow(() -> new EntityNotFoundException("passenger_travel_not_found"));
        passengerTravelRepository.delete(passengerTravel);
        return ok(success("Pasajero eliminado del viaje correctamente").total(passengerTravelRepository.count()).build());
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
        GeneralException exception = new PassengerTravelException(e.getCause(), messageSource, locale);
        return ok(failure(exception.tratarExcepcion()).build());
    }
}
