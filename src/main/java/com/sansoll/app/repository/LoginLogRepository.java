package com.sansoll.app.repository;

import com.sansoll.app.entity.LoginLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LoginLogRepository extends JpaRepository<LoginLog, Long> {

    // Просто вытаскиваем даты за период, группировать будем в Java
    @Query("SELECT l.loginAt FROM LoginLog l WHERE l.loginAt >= :from ORDER BY l.loginAt")
    List<LocalDateTime> findLoginDatesSince(@Param("from") LocalDateTime from);
}