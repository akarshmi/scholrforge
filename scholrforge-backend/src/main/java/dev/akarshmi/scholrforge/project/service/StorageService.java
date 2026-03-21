package dev.akarshmi.scholrforge.project.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
public interface StorageService {
    String uploadProjectFile(MultipartFile file);
    String uploadMedia(MultipartFile file, UUID id);
    void deleteFile(String fileName);
}
