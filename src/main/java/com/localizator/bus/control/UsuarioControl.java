package com.localizator.bus.control;

import com.localizator.bus.entity.Rol;
import com.localizator.bus.entity.Usuario;
import com.localizator.bus.exception.GeneralException;
import com.localizator.bus.exception.UsuarioException;
import com.localizator.bus.repository.RolRepository;
import com.localizator.bus.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
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
public class UsuarioControl {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private MessageSource messageSource;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping(value = "/usuario")
    public ResponseEntity<AppResponse<Usuario>> listarUsuarios(Pageable pageable) {
        Page<Usuario> usuarios = usuarioRepository.findAll(pageable);
        return ok(success(usuarios.getContent()).total(usuarios.getTotalElements()).build());
    }

    @PostMapping(value = "/usuario")
    public ResponseEntity<AppResponse<Usuario>> insertarUsuario(@Valid @RequestBody Usuario usuario) {
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        usuarioRepository.saveAndFlush(usuario);
        return ok(success(usuario).build());
    }

    @PutMapping(value = "/usuario/{idUsuario}")
    public ResponseEntity<AppResponse<Usuario>> actualizarUsuario(@PathVariable("idUsuario") Optional<Usuario> optional, @RequestBody Usuario usuario, @AuthenticationPrincipal Usuario logeado) {
        final Usuario usuarioBd = optional.orElseThrow(() -> new EntityNotFoundException("user_not_found"));
        if (!usuario.getActivated() && logeado.equals(usuarioBd)) {
            return ok(failure("No se puede desactivar usted mismo.").build());
        }
        usuarioBd.clone(usuario);
        Optional.ofNullable(usuario.getPassword()).ifPresent(password -> {
            if (!password.isEmpty()) {
                usuarioBd.setPassword(passwordEncoder.encode(password));
            }
        });
        usuarioRepository.saveAndFlush(usuarioBd);
        return ok(success(usuarioBd).build());
    }

    @DeleteMapping(value = "/usuario/{idUsuario}")
    public ResponseEntity<AppResponse> eliminarUsuario(@PathVariable("idUsuario") Optional<Usuario> optional) {
        Usuario usuario = optional.orElseThrow(() -> new EntityNotFoundException("user_not_found"));
        usuarioRepository.delete(usuario);
        return ok(success("Usuario eliminado correctamente").total(usuarioRepository.count()).build());
    }

    @GetMapping(value = "/roles")
    public ResponseEntity<AppResponse<Rol>> listRoles() {
        List<Rol> rolList = rolRepository.findAll();
        return ok(success(rolList).total(rolList.size()).build());
    }

    @GetMapping(value = "/account")
    public ResponseEntity<AppResponse<Usuario>> getAuthenticatedUser(@AuthenticationPrincipal Usuario usuario) {
        return ok(success(usuario).build());
    }

    @PostMapping(value = "/language/change")
    public ResponseEntity<AppResponse<Boolean>> changeLanguage(@RequestParam String language, @AuthenticationPrincipal Usuario usuario) {
        System.out.println(language);
        usuario.setLanguage(language);
        usuarioRepository.saveAndFlush(usuario);
        return ok(success().build());
    }

    @GetMapping(value = "/enviar")
    public ResponseEntity<AppResponse> pushNotification() {
        String instanceId = "305e1ea8-084c-40b5-a3c3-a700013212ba";
        String secretKey = "300814DF975AE861AEBED3259E6CFC9C51D1463031BD4DE79040B27FB836473C";
        List<String> interests = Arrays.asList("donuts", "pizza");
        Map<String, Map> publishRequest = new HashMap<>();
        Map<String, String> alert = new HashMap();
        alert.put("alert", "hi");
        Map<String, Map> aps = new HashMap();
        aps.put("aps", alert);
        publishRequest.put("apns", aps);

        Map<String, String> fcmNotification = new HashMap();
        fcmNotification.put("title", "hello");
        fcmNotification.put("body", "Hello world");
        Map<String, Map> fcm = new HashMap();
        fcm.put("notification", fcmNotification);
        publishRequest.put("fcm", fcm);
        return ok(success("Mensaje enviado OK").build());
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
        GeneralException exception = new UsuarioException(e.getCause(), messageSource, locale);
        return ok(failure(exception.tratarExcepcion()).build());
    }
}
