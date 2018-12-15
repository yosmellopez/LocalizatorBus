package com.localizator.bus.sheduledtask;

import com.localizator.bus.entity.Notification;
import com.localizator.bus.entity.Travel;
import com.localizator.bus.repository.NotificationRepository;
import com.localizator.bus.repository.TravelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AppTasks {

    private final TravelRepository travelRepository;

    private final NotificationRepository notificationRepository;

    private final SimpMessagingTemplate template;

    @Autowired
    public AppTasks(TravelRepository travelRepository, SimpMessagingTemplate template, NotificationRepository notificationRepository) {
        this.travelRepository = travelRepository;
        this.template = template;
        this.notificationRepository = notificationRepository;
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

}
