package com.localizator.bus.repository;

import com.localizator.bus.entity.PassengerTravel;
import com.localizator.bus.entity.PassengerTravelPK;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PassengerTravelRepository extends JpaRepository<PassengerTravel, PassengerTravelPK> {

}
