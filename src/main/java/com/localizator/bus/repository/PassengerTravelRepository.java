package com.localizator.bus.repository;

import com.localizator.bus.entity.PassengerTravel;
import com.localizator.bus.entity.PassengerTravelPK;
import com.localizator.bus.entity.Travel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PassengerTravelRepository extends JpaRepository<PassengerTravel, PassengerTravelPK> {

    List<PassengerTravel> findByTravel(Travel travel);

    int deleteByTravel(Travel travel);
}
