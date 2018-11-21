package com.localizator.bus.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "notification")
public class Notification implements Serializable, Comparable<Notification> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id")
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "icono")
    private String icono;

    @Column(name = "fecha")
    @Temporal(TemporalType.TIMESTAMP)
    private Date fecha;

    @JsonIgnore
    @OneToMany(mappedBy = "notification")
    private List<UsuarioNotification> usuarioNotifications;

    @Transient
    private String mensaje;

    public Notification() {
    }

    public Notification(String title, String description, Date fecha) {
        this.title = title;
        this.description = description;
        this.fecha = fecha;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public List<UsuarioNotification> getUsuarioNotifications() {
        return usuarioNotifications;
    }

    public void setUsuarioNotifications(List<UsuarioNotification> usuarioNotifications) {
        this.usuarioNotifications = usuarioNotifications;
    }

    public String getIcono() {
        return icono;
    }

    public void setIcono(String icono) {
        this.icono = icono;
    }

    public String getMensaje() {
        mensaje = fechaActual(fecha, new Date());
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    private String fechaActual(Date fechaInicial, Date fechaFinal) {
        String mensajeTiempo;
        if (fechaFinal.getTime() - fechaInicial.getTime() <= 60000) {
            mensajeTiempo = "Unos segundos atr\u00e1s";
        } else if (fechaFinal.getTime() - fechaInicial.getTime() > 60000 && fechaFinal.getTime() - fechaInicial.getTime() <= 3600000) {
            mensajeTiempo = ((fechaFinal.getTime() - fechaInicial.getTime()) / 60000) + " minutos atr\u00e1s";
        } else if (fechaFinal.getTime() - fechaInicial.getTime() > 60000 && fechaFinal.getTime() - fechaInicial.getTime() <= 86400000) {
            mensajeTiempo = "" + ((fechaFinal.getTime() - fechaInicial.getTime()) / 3600000) + " hrs " + (((fechaFinal.getTime() - fechaInicial.getTime()) % 3600000) / 60000) + " minutos atr\u00e1s";
        } else if ((fechaFinal.getTime() - fechaInicial.getTime()) > 86400000 && fechaFinal.getTime() - fechaInicial.getTime() <= 2678400000L) {
            int dias = (int) ((fechaFinal.getTime() - fechaInicial.getTime()) / 86400000);
            mensajeTiempo = dias + (dias == 1 ? " día atr\u00e1s." : " días atr\u00e1s.");
        } else {
            int mes = (int) ((fechaFinal.getTime() / 2678400000L) - (fechaInicial.getTime() / 2678400000L));
            mensajeTiempo = mes + (mes == 1 ? " mes atr\u00e1s." : " meses atr\u00e1s.");
        }
        return mensajeTiempo;
    }

    @Override
    public int compareTo(Notification o) {
        return o.fecha.compareTo(fecha);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Notification that = (Notification) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {

        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Notification{" + "id=" + id + ", title='" + title + '\'' + ", description='" + description + '\'' + ", fecha=" + fecha + '}';
    }

}
