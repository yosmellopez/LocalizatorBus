package com.localizator.bus.sheduledtask;

import com.localizator.bus.entity.Travel;
import com.localizator.bus.repository.TravelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AppTasks {

    private final TravelRepository travelRepository;

    @Autowired
    public AppTasks(TravelRepository travelRepository) {
        this.travelRepository = travelRepository;
    }

    @Transactional
    @Scheduled(cron = "0 57 14 * * *")
    public void deleteEmptyTravels() {
        System.out.println("Probando servicio de tareas");
        List<Travel> travels = travelRepository.findAll();
        Set<Travel> travelSet = travels.parallelStream().filter(travel -> travel.getPassengerTravels().isEmpty()).collect(Collectors.toSet());
        travelSet.forEach(travel -> travelRepository.delete(travel));
    }

}
