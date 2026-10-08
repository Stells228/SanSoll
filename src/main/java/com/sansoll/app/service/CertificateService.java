package com.sansoll.app.service;

import com.sansoll.app.entity.Certificate;
import com.sansoll.app.repository.CertificateRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CertificateService {

    private final CertificateRepository certificateRepository;

    public CertificateService(CertificateRepository certificateRepository) {
        this.certificateRepository = certificateRepository;
    }

    public List<Certificate> getAll() {
        return certificateRepository.findAll();
    }
}