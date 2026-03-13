package dev.akarshmi.scholrforge.project.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StorageServiceImpl implements StorageService {
    @Override
    public String uploadProjectFile(MultipartFile multipartFile, UUID userId) {
        return "";
    }

    @Override
    public String uploadMedia(MultipartFile file, UUID id) {
        return "";
    }
}
