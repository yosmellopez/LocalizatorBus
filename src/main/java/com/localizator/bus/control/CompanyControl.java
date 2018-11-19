package com.localizator.bus.control;

import com.localizator.bus.entity.Company;
import com.localizator.bus.exception.CompanyException;
import com.localizator.bus.exception.GeneralException;
import com.localizator.bus.repository.CompanyRepository;
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
import static org.springframework.http.ResponseEntity.ok;


@RestController
@RequestMapping(value = "/api")
public class CompanyControl {

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private MessageSource messageSource;

    @GetMapping(value = "/company")
    public ResponseEntity<AppResponse<Company>> listarCompanys(Pageable pageable) {
        Page<Company> companys = companyRepository.findAll(pageable);
        return ok(success(companys.getContent()).total(companys.getTotalElements()).build());
    }

    @GetMapping(value = "/company/all")
    public ResponseEntity<AppResponse<Company>> listarAllCompanys() {
        List<Company> companys = companyRepository.findAll();
        return ok(success(companys).total(companys.size()).build());
    }

    @PostMapping(value = "/company")
    public ResponseEntity<AppResponse<Company>> insertarCompany(@Valid @RequestBody Company company) {
        companyRepository.saveAndFlush(company);
        return ok(success(company).build());
    }

    @PutMapping(value = "/company/{idCompany}")
    public ResponseEntity<AppResponse<Company>> actualizarCompany(@PathVariable("idCompany") Optional<Company> optional, @RequestBody Company company) {
        Company companyBd = optional.orElseThrow(() -> new EntityNotFoundException("company_not_found"));
        companyBd.clone(company);
        companyRepository.saveAndFlush(companyBd);
        return ok(success(companyBd).build());
    }

    @DeleteMapping(value = "/company/{idCompany}")
    public ResponseEntity<AppResponse> eliminarCompany(@PathVariable("idCompany") Optional<Company> optional) {
        Company company = optional.orElseThrow(() -> new EntityNotFoundException("company_not_found"));
        companyRepository.delete(company);
        return ok(success("Company eliminado correctamente").total(companyRepository.count()).build());
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
        GeneralException exception = new CompanyException(e.getCause(), messageSource, locale);
        return ok(failure(exception.tratarExcepcion()).build());
    }
}
