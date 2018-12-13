package com.localizator.bus.control;

import com.localizator.bus.entity.Bus;
import com.localizator.bus.entity.Company;
import com.localizator.bus.entity.Usuario;
import com.localizator.bus.exception.GeneralException;
import com.localizator.bus.exception.BusException;
import com.localizator.bus.repository.BusRepository;
import com.localizator.bus.security.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
public class BusControl {

    private final BusRepository busRepository;

    private final MessageSource messageSource;

    @Autowired
    public BusControl(BusRepository busRepository, MessageSource messageSource) {
        this.busRepository = busRepository;
        this.messageSource = messageSource;
    }

    @GetMapping(value = "/bus")
    public ResponseEntity<AppResponse<Bus>> listarBuss(Pageable pageable, @AuthenticationPrincipal Usuario usuario) {
        if (SecurityUtils.isAdmin()) {
            Page<Bus> buss = busRepository.findAll(pageable);
            return ok(success(buss.getContent()).total(buss.getTotalElements()).build());
        } else {
            Company company = usuario.getCompanies().parallelStream().findFirst().get();
            Page<Bus> buss = busRepository.findByCompany(company, pageable);
            return ok(success(buss.getContent()).total(buss.getTotalElements()).build());
        }
    }

    @GetMapping(value = "/bus/all")
    public ResponseEntity<AppResponse<Bus>> listarAllBuss(@AuthenticationPrincipal Usuario usuario) {
        if (SecurityUtils.isAdmin()) {
            List<Bus> buss = busRepository.findAll();
            return ok(success(buss).total(buss.size()).build());
        } else {
            Company company = usuario.getCompanies().parallelStream().findFirst().get();
            List<Bus> buss = busRepository.findByCompany(company);
            return ok(success(buss).total(buss.size()).build());
        }
    }

    @PostMapping(value = "/bus")
    public ResponseEntity<AppResponse<Bus>> insertarBus(@Valid @RequestBody Bus bus, Locale locale) {
        Company company = bus.getCompany();
        long cantidad = busRepository.countByCompany(company);
        if (cantidad < company.getBusCount()) {
            busRepository.saveAndFlush(bus);
            return ok(success(bus).build());
        } else
            return ok(failure(messageSource.getMessage("company_bus_excedded", new Object[]{company.getName()}, locale)).build());
    }

    @PutMapping(value = "/bus/{idBus}")
    public ResponseEntity<AppResponse<Bus>> actualizarBus(@PathVariable("idBus") Optional<Bus> optional, @RequestBody Bus bus) {
        Bus busBd = optional.orElseThrow(() -> new EntityNotFoundException("bus_not_found"));
        busBd.clone(bus);
        busRepository.saveAndFlush(busBd);
        return ok(success(busBd).build());
    }

    @DeleteMapping(value = "/bus/{idBus}")
    public ResponseEntity<AppResponse> eliminarBus(@PathVariable("idBus") Optional<Bus> optional) {
        Bus bus = optional.orElseThrow(() -> new EntityNotFoundException("bus_not_found"));
        busRepository.delete(bus);
        return ok(success("Bus eliminado correctamente").total(busRepository.count()).build());
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
        e.printStackTrace();
        GeneralException exception = new BusException(e.getCause(), messageSource, locale);
        return ok(failure(exception.tratarExcepcion()).build());
    }
}
