package com.localizator.bus.repository;

import com.localizator.bus.entity.Place;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlaceRepository extends JpaRepository<Place, Long> {

    List<Place> findByStretch(boolean stretch);
}
