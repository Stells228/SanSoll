package com.sansoll.app.service;

import com.sansoll.app.entity.Certificate;
import com.sansoll.app.repository.CertificateRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

@Service
public class AdminCertificateService {

    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/certificates/";

    private final CertificateRepository certificateRepository;

    public AdminCertificateService(CertificateRepository certificateRepository) {
        this.certificateRepository = certificateRepository;
    }

    public List<Certificate> getAll() {
        List<Certificate> certs = certificateRepository.findAll();
        certs.sort((c1, c2) -> {
            if (c1.getPosition() == null) return 1;
            if (c2.getPosition() == null) return -1;
            return c1.getPosition().compareTo(c2.getPosition());
        });
        return certs;
    }

    public Certificate upload(MultipartFile file, String title) {
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
            String newFilename = "cert_" + System.currentTimeMillis() + extension;

            Files.copy(file.getInputStream(), Paths.get(UPLOAD_DIR + newFilename));
            String imageUrl = "/uploads/certificates/" + newFilename;

            Certificate cert = new Certificate();
            cert.setTitle(title);
            cert.setImageUrl(imageUrl);
            cert.setPosition((int) (certificateRepository.count() + 1));
            return certificateRepository.save(cert);
        } catch (Exception e) {
            throw new RuntimeException("Ошибка загрузки сертификата: " + e.getMessage());
        }
    }

    public void updateTitle(Long id, String title) {
        Certificate cert = certificateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Сертификат не найден"));
        cert.setTitle(title);
        certificateRepository.save(cert);
    }

    public void reorder(List<Certificate> certs) {
        for (Certificate certData : certs) {
            Certificate cert = certificateRepository.findById(certData.getId())
                    .orElseThrow(() -> new RuntimeException("Сертификат не найден"));
            cert.setPosition(certData.getPosition());
            certificateRepository.save(cert);
        }
    }

    public void delete(Long id) {
        certificateRepository.deleteById(id);
    }
}