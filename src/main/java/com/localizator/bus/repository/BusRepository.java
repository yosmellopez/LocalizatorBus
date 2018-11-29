package com.localizator.bus.repository;

import com.localizator.bus.entity.Bus;
import com.localizator.bus.entity.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Set;

public interface BusRepository extends JpaRepository<Bus, Long> {

    long countByCompany(Company company);

    List<Bus> findByCompany(Company company);

    Page<Bus> findByCompany(Company company, Pageable pageable);
}
