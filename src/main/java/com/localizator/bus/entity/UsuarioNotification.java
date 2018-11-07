package com.localizator.bus.entity;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "usuario_notification")
public class UsuarioNotification implements Serializable, ClonableEntity<UsuarioNotification> {

    @EmbeddedId
    private UsuarioNotificationPK usuarioNotificationPK;

    @ManyToOne
    @JoinColumn(name = "notification_id", insertable = false, updatable = false, foreignKey = @ForeignKey(name = "fk_usuario_notification"))
    private Notification notification;

    @ManyToOne
    @JoinColumn(name = "usuario_id", insertable = false, updatable = false, foreignKey = @ForeignKey(name = "fk_notification_usuario"))
    private Usuario usuario;

    @Column(name = "visto")
    private Boolean visto;

    public UsuarioNotification() {
    }

    public UsuarioNotification(Notification notification, Usuario usuario, Boolean visto) {
        this.notification = notification;
        this.usuario = usuario;
        this.visto = visto;
    }

    public UsuarioNotificationPK getUsuarioNotificationPK() {
        return usuarioNotificationPK;
    }

    public void setUsuarioNotificationPK(UsuarioNotificationPK usuarioNotificationPK) {
        this.usuarioNotificationPK = usuarioNotificationPK;
    }

    public Notification getNotification() {
        return notification;
    }

    public void setNotification(Notification notification) {
        this.notification = notification;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Boolean getVisto() {
        return visto;
    }

    public void setVisto(Boolean visto) {
        this.visto = visto;
    }

    @PrePersist
    public void createPrimaryKey() {
        usuarioNotificationPK = new UsuarioNotificationPK(usuario.getId(), notification.getId());
    }

    @Override
    public void clone(UsuarioNotification usuarioNotification) {
        visto = usuarioNotification.visto;
    }
}
