package com.localizator.bus;

import com.localizator.bus.dto.Gisgraphy;
import com.localizator.bus.dto.Result;
import com.localizator.bus.repository.PassengerTravelRepository;
import com.localizator.bus.service.LocalizationService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.Set;

@RunWith(SpringRunner.class)
@SpringBootTest
public class BusApplicationTests {

    @Autowired
    PassengerTravelRepository passengerTravelRepository;

    @Test
    public void contextLoads() {
        Gisgraphy gisgraphy = LocalizationService.getAutoComplete("Las Tunas");
        Set<Result> results = gisgraphy.getResponse().getResult();
        for (Result result : results) {
            System.out.println(result);
        }
    }

}
