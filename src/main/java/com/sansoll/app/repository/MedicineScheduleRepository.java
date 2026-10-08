package com.sansoll.app.repository;

import com.sansoll.app.entity.MedicineSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MedicineScheduleRepository extends JpaRepository<MedicineSchedule, Long> {

    // Derived query — Spring сам построит ORDER BY
    List<MedicineSchedule> findByUser_UsernameAndDateOrderByIdAsc(String username, LocalDate date);

    List<MedicineSchedule> findByUser_Username(String username);

    void deleteByUserMedicine_Id(Long userMedicineId);

    @Query("SELECT DISTINCT s.date FROM MedicineSchedule s WHERE s.user.username = :username ORDER BY s.date DESC")
    List<LocalDate> findDistinctDatesByUsername(@Param("username") String username);
}