package dev.akarshmi.scholrforge;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ScholrforgeApplication {

	static void main(String[] args) {
		System.setProperty(
				"org.apache.tomcat.util.http.fileupload.FileUploadBase.fileCountMax",
				"200"
		);
		SpringApplication.run(ScholrforgeApplication.class, args);
	}

}
