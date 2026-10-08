package com.sansoll.app.repository;

import com.sansoll.app.entity.UserMedicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserMedicineRepository extends JpaRepository<UserMedicine, Long> {

    List<UserMedicine> findByUser_Username(String username);

    /** Найти запись пользователя по конкретному товару (для автопополнения аптечки). */
    Optional<UserMedicine> findByUser_UsernameAndProduct_Id(String username, Long productId);
}