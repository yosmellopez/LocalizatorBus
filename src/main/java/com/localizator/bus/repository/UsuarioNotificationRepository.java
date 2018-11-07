package com.localizator.bus.repository;

import com.localizator.bus.entity.Usuario;
import com.localizator.bus.entity.UsuarioNotification;
import com.localizator.bus.entity.UsuarioNotificationPK;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UsuarioNotificationRepository extends JpaRepository<UsuarioNotification, UsuarioNotificationPK> {

    List<UsuarioNotification> findByUsuario(Usuario usuario);

    List<UsuarioNotification> findByUsuarioAndVisto(Usuario usuario, boolean visto);
}
