package com.sansoll.app.service;

import com.sansoll.app.dto.ProductDto;
import com.sansoll.app.entity.Product;
import com.sansoll.app.entity.ProductImage;
import com.sansoll.app.mapper.ProductMapper;
import com.sansoll.app.repository.CategoryRepository;
import com.sansoll.app.repository.PartnerRepository;
import com.sansoll.app.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminProductService {

    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/products/";

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final PartnerRepository partnerRepository;
    private final ProductMapper productMapper;

    public AdminProductService(ProductRepository productRepository,
                               CategoryRepository categoryRepository,
                               PartnerRepository partnerRepository,
                               ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.partnerRepository = partnerRepository;
        this.productMapper = productMapper;
    }

    public List<ProductDto> getAllProducts() {
        return productRepository.findAll().stream()
                .map(productMapper::toDto)
                .collect(Collectors.toList());
    }

    public ProductDto createProduct(ProductDto dto) {
        Product product = new Product();
        mapDtoToProduct(dto, product);
        return productMapper.toDto(productRepository.save(product));
    }

    public ProductDto updateProduct(Long id, ProductDto dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Товар не найден"));
        product.getImages().clear();
        mapDtoToProduct(dto, product);
        return productMapper.toDto(productRepository.save(product));
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public void toggleVisibility(Long id, Boolean isActive) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Товар не найден"));
        product.setIsActive(isActive);
        productRepository.save(product);
    }

    public String uploadImage(MultipartFile file) {
        try {
            File dir = new File(UPLOAD_DIR);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || !originalFilename.contains(".")) {
                throw new RuntimeException("Некорректное имя файла");
            }

            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String newFilename = "prod_" + System.currentTimeMillis() + extension;

            Files.copy(file.getInputStream(), Paths.get(UPLOAD_DIR + newFilename));
            return "/uploads/products/" + newFilename;
        } catch (Exception e) {
            throw new RuntimeException("Ошибка загрузки картинки: " + e.getMessage());
        }
    }

    private void mapDtoToProduct(ProductDto dto, Product product) {
        product.setTitle(dto.getTitle());
        product.setPrice(dto.getPrice());
        product.setDescription(dto.getDescription());
        product.setComposition(dto.getComposition());
        product.setIndications(dto.getIndications());
        product.setDosage(dto.getDosage());
        product.setContraindications(dto.getContraindications());
        product.setManufacturer(dto.getManufacturer());
        product.setDosageForm(dto.getDosageForm());
        product.setDefaultDosage(dto.getDefaultDosage());
        product.setStock(dto.getStock());
        product.setDiscount(dto.getDiscount());
        product.setIsBad(dto.getIsBad() != null ? dto.getIsBad() : false);
        product.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);

        if (dto.getCategoryId() != null) {
            product.setCategory(categoryRepository.findById(dto.getCategoryId()).orElse(null));
        }
        if (dto.getPartnerId() != null) {
            product.setPartner(partnerRepository.findById(dto.getPartnerId()).orElse(null));
        }

        if (dto.getImageUrls() != null) {
            for (String url : dto.getImageUrls()) {
                ProductImage img = new ProductImage();
                img.setImageUrl(url);
                img.setProduct(product);
                product.getImages().add(img);
            }
        }
    }
}