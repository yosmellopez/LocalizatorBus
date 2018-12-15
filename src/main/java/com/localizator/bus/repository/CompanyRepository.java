package com.localizator.bus.repository;

import com.localizator.bus.entity.Company;
import com.localizator.bus.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CompanyRepository extends JpaRepository<Company, Long> {

}
