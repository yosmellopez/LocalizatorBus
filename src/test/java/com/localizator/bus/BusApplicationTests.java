package com.localizator.bus;

import com.localizator.bus.entity.PassengerTravel;
import com.localizator.bus.repository.PassengerTravelRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RunWith(SpringRunner.class)
@SpringBootTest
public class BusApplicationTests {

    @Autowired
    PassengerTravelRepository passengerTravelRepository;

    @Test
    public void contextLoads() {
        final List<PassengerTravel> passengerTravels = passengerTravelRepository.findAll();
        Set<PassengerTravel> collect = passengerTravels.parallelStream().collect(Collectors.toSet());
        collect.forEach(passengerTravel -> {
            long count = passengerTravels.parallelStream().filter(travelpassenger -> passengerTravel.equals(travelpassenger)).count();
            System.out.println(passengerTravel.getPassengerTravelPK() + " " + count);
        });
    }

}
