package dev.akarshmi.scholrforge.project.service;

import dev.akarshmi.scholrforge.common.constants.ProjectConstants;
import dev.akarshmi.scholrforge.project.exceptions.ProjectUploadingException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StorageServiceImpl implements StorageService {

    @Value("${FILE_SAVE_LOCATION:C://scholrforge//uploads}")
    private String location;

    @Override
    public String uploadProjectFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ProjectUploadingException("File must not be empty");
        }
        if (file.getSize() >= 75L * 1024 * 1024) {
            throw new ProjectUploadingException(ProjectConstants.PROJECT_FILE_EXCEEDED);
        }

        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null || originalFileName.isBlank()) {
            originalFileName = "project.zip";
        }

        String filename  = System.currentTimeMillis() + "_" + UUID.randomUUID() + "_" + originalFileName;
        Path   uploadDir = Paths.get(location);
        Path   target    = uploadDir.resolve(filename);

        try {
            // ── Fix 2: create directory if it doesn't exist ────────────────
            Files.createDirectories(uploadDir);

            // ── Fix 3: actually throw if copy fails ────────────────────────
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new ProjectUploadingException("Failed to save file: " + e.getMessage());
        }

        System.out.println("[StorageService] saved: " + target);
        return target.toString();
    }

    @Override
    public String uploadMedia(MultipartFile file, UUID id) {
        return "";
    }

    @Override
    public void deleteFile(String fileName) {
        try {
            // fileName may be a full path or just a name — handle both
            Path path = Paths.get(fileName).isAbsolute()
                    ? Paths.get(fileName)
                    : Paths.get(location).resolve(fileName);
            Files.deleteIfExists(path);
        } catch (IOException e) {
            System.err.println("[StorageService] could not delete file: " + fileName + " — " + e.getMessage());
        }
    }
}