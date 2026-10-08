package com.sansoll.app.service;

import com.sansoll.app.entity.Category;
import com.sansoll.app.entity.Partner;
import com.sansoll.app.repository.CategoryRepository;
import com.sansoll.app.repository.PartnerRepository;
import org.springframework.stereotype.Service;

@Service
public class AdminDictService {

    private final CategoryRepository categoryRepository;
    private final PartnerRepository partnerRepository;

    public AdminDictService(CategoryRepository categoryRepository,
                            PartnerRepository partnerRepository) {
        this.categoryRepository = categoryRepository;
        this.partnerRepository = partnerRepository;
    }

    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }

    public Partner createPartner(Partner partner) {
        return partnerRepository.save(partner);
    }

    public void deletePartner(Long id) {
        partnerRepository.deleteById(id);
    }
}