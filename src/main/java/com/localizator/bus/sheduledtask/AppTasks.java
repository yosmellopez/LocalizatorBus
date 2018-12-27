package com.localizator.bus.sheduledtask;

import com.localizator.bus.dto.TraccarPosition;
import com.localizator.bus.entity.Device;
import com.localizator.bus.entity.Notification;
import com.localizator.bus.entity.Travel;
import com.localizator.bus.repository.DeviceRepository;
import com.localizator.bus.repository.NotificationRepository;
import com.localizator.bus.repository.TravelRepository;
import com.localizator.bus.service.LocalizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AppTasks {

    private final TravelRepository travelRepository;

    private final DeviceRepository deviceRepository;

    private final NotificationRepository notificationRepository;

    private final SimpMessagingTemplate template;

    @Autowired
    public AppTasks(TravelRepository travelRepository, SimpMessagingTemplate template, NotificationRepository notificationRepository, DeviceRepository deviceRepository) {
        this.travelRepository = travelRepository;
        this.template = template;
        this.notificationRepository = notificationRepository;
        this.deviceRepository = deviceRepository;
    }

    @Transactional
    @Scheduled(cron = "0 0 0 * * *")
    public void deleteEmptyTravels() {
        System.out.println("Probando servicio de tareas");
        List<Travel> travels = travelRepository.findAll();
        Set<Travel> travelSet = travels.parallelStream().filter(travel -> travel.getPassengerTravels().isEmpty()).collect(Collectors.toSet());
        travelSet.forEach(travel -> travelRepository.delete(travel));
    }

    //    @Scheduled(fixedDelay = 180000)
    public void publishUpdates() {
        Notification notification = notificationRepository.findById(5L).orElseThrow(() -> new EntityNotFoundException("No se encontro la notificacion"));
        template.convertAndSend("/buslocator/notificacion/admin", notification);
    }

    @Scheduled(fixedDelay = 600000)
    public void udateDevices() {
        List<Device> devices = LocalizationService.listDevices();
        for (Device device : devices) {
            List<TraccarPosition> positions = LocalizationService.listPositions();
            Optional<TraccarPosition> positionOptional = positions.parallelStream().filter(traccarPosition -> traccarPosition.getDeviceId() == device.getDeviceId()).findFirst();
            Optional<Device> optional = deviceRepository.findByUniqueId(device.getUniqueId());
            positionOptional.ifPresent(traccarPosition -> {
                device.setLatitude(traccarPosition.getLatitude());
                device.setLongitude(traccarPosition.getLongitude());
            });
            if (optional.isPresent()) {
                Device deviceBd = optional.get();
                deviceBd.clone(device);
                deviceRepository.saveAndFlush(deviceBd);
            } else
                deviceRepository.saveAndFlush(device);
        }
    }

}
