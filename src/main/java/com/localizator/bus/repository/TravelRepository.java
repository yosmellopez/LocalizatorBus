package com.localizator.bus.repository;

import com.localizator.bus.entity.Company;
import com.localizator.bus.entity.Travel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.List;

public interface TravelRepository extends JpaRepository<Travel, Long> {

    List<Travel> findByActive(boolean active);

    Page<Travel> findByActive(boolean active, Pageable pageable);

    List<Travel> findByBus_Company(Company company);

    List<Travel> findByTravelDateAfterAndArriveDateBefore(Date start, Date limit);

    Page<Travel> findByBus_Company(Company company, Pageable pageable);
}
