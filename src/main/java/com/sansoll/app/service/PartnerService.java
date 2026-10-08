package com.sansoll.app.service;

import com.sansoll.app.entity.Partner;
import com.sansoll.app.repository.PartnerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PartnerService {

    private final PartnerRepository partnerRepository;

    public PartnerService(PartnerRepository partnerRepository) {
        this.partnerRepository = partnerRepository;
    }

    public List<Partner> getAll() {
        return partnerRepository.findAll();
    }
}