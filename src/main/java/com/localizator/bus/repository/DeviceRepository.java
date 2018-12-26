package com.localizator.bus.repository;

import com.localizator.bus.entity.Device;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DeviceRepository extends JpaRepository<Device, Long> {

    Optional<Device> findByUniqueId(Long uniqueId);
}
