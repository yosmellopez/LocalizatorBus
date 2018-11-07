package com.localizator.bus.entity;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class UsuarioNotificationPK implements Serializable {

    @Column(name = "usuario_id")
    private Long usuarioId;

    @Column(name = "notification_id")
    private Long notificationId;

    public UsuarioNotificationPK() {
    }

    public UsuarioNotificationPK(Long usuarioId, Long notificationId) {
        this.usuarioId = usuarioId;
        this.notificationId = notificationId;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public Long getNotificationId() {
        return notificationId;
    }

    public void setNotificationId(Long notificationId) {
        this.notificationId = notificationId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UsuarioNotificationPK that = (UsuarioNotificationPK) o;
        return Objects.equals(usuarioId, that.usuarioId) &&
                Objects.equals(notificationId, that.notificationId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(usuarioId, notificationId);
    }

    @Override
    public String toString() {
        return "UsuarioNotificationPK{" +
                "usuarioId=" + usuarioId +
                ", notificationId=" + notificationId +
                '}';
    }
}
