package com.localizator.bus.control;

import com.localizator.bus.entity.Device;
import com.localizator.bus.entity.Usuario;
import com.localizator.bus.exception.DeviceException;
import com.localizator.bus.exception.GeneralException;
import com.localizator.bus.implement.DeviceRunnable;
import com.localizator.bus.repository.DeviceRepository;
import com.localizator.bus.security.SecurityUtils;
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
public class DeviceControl {

    private final DeviceRepository deviceRepository;

    private final MessageSource messageSource;

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public DeviceControl(DeviceRepository deviceRepository, MessageSource messageSource, SimpMessagingTemplate messagingTemplate) {
        this.deviceRepository = deviceRepository;
        this.messageSource = messageSource;
        this.messagingTemplate = messagingTemplate;
    }

    @GetMapping(value = "/device")
    public ResponseEntity<AppResponse<Device>> listarDevices(Pageable pageable) {
        Page<Device> devices = deviceRepository.findAll(pageable);
        return ok(success(devices.getContent()).total(devices.getTotalElements()).build());
    }

    @GetMapping(value = "/device/all")
    public ResponseEntity<AppResponse<Device>> listarAllDevices() {
        List<Device> devices = deviceRepository.findAll();
        return ok(success(devices).total(devices.size()).build());
    }

    @PostMapping(value = "/device")
    public ResponseEntity<AppResponse<Device>> insertarDevice(@Valid @RequestBody Device device) {
        deviceRepository.saveAndFlush(device);
        Thread thread = new Thread(new DeviceRunnable(device, deviceRepository, messagingTemplate));
        thread.start();
        return ok(success(device).build());
    }

    @PutMapping(value = "/device/{idDevice}")
    public ResponseEntity<AppResponse<Device>> actualizarDevice(@PathVariable("idDevice") Optional<Device> optional, @Valid @RequestBody Device device) {
        Device deviceBd = optional.orElseThrow(() -> new EntityNotFoundException("device_not_found"));
        deviceBd.clone(device);
        deviceRepository.saveAndFlush(deviceBd);
        return ok(success(deviceBd).build());
    }

    @DeleteMapping(value = "/device/{idDevice}")
    public ResponseEntity<AppResponse> eliminarDevice(@PathVariable("idDevice") Optional<Device> optional) {
        Device device = optional.orElseThrow(() -> new EntityNotFoundException("device_not_found"));
        deviceRepository.delete(device);
        return ok(success("Device eliminado correctamente").total(deviceRepository.count()).build());
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
        GeneralException exception = new DeviceException(e.getCause(), messageSource, locale);
        return ok(failure(exception.tratarExcepcion()).build());
    }
}
