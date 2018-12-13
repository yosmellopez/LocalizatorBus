package com.localizator.bus.service;

import com.localizator.bus.entity.Notification;
import com.localizator.bus.entity.Rol;
import com.localizator.bus.entity.Usuario;
import com.localizator.bus.entity.UsuarioNotification;
import com.localizator.bus.repository.NotificationRepository;
import com.localizator.bus.repository.UsuarioNotificationRepository;
import com.localizator.bus.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class NotificationService {

    @Autowired
    private UsuarioNotificationRepository usuarioNotificationRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private SimpMessagingTemplate template;

    public void createNotificacion(final Notification notification, Usuario usuario, boolean notifyAdmins) {
        notificationRepository.saveAndFlush(notification);
        template.convertAndSend("/buslocator/notificacion/" + usuario.getUsername(), notification);
        Set<Usuario> usuarios = new HashSet<>(Arrays.asList(usuario));
        if (notifyAdmins) {
            usuarios.addAll(usuarioRepository.findByRol(new Rol(1)));
            template.convertAndSend("/buslocator/notificacion/admin", notification);
        }
        usuarios.forEach(user -> {
            UsuarioNotification usuarioNotification = new UsuarioNotification(notification, user, false);
            usuarioNotificationRepository.save(usuarioNotification);
        });
        if (!usuarios.isEmpty()) {
            usuarioNotificationRepository.flush();
        }
    }
}
