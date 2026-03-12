package dev.akarshmi.scholrforge.common.helper;

import org.springframework.stereotype.Component;
import java.text.Normalizer;
import java.util.function.Function;

@Component
public class SlugGenerator {

    public static String toSlug(String input) {
        String slug = Normalizer.normalize(input, Normalizer.Form.NFD);
        slug = slug.replaceAll("[^\\w\\s-]", "");
        slug = slug.trim().toLowerCase();
        slug = slug.replaceAll("\\s+", "-");
        return slug;
    }

    public String generateUniqueSlug(String input, Function<String, Boolean> existsChecker) {
        String baseSlug = toSlug(input);
        String slug = baseSlug;
        int counter = 1;

        while (existsChecker.apply(slug)) {
            slug = baseSlug + "-" + counter++;
        }

        return slug;
    }
}