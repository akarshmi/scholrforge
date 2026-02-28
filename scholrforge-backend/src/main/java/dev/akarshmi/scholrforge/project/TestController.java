package dev.akarshmi.scholrforge.project;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v8/")
public class TestController {

    @PostMapping("test")
    public String testController(){
        return "tested";
    }
}
