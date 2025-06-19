package com.project.safe.controller;

import com.project.safe.domain.Lamp;
import com.project.safe.repository.LampRepository;
// import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class LampController {

    private final LampRepository lampRepository;

    public LampController(LampRepository lampRepository) {
        this.lampRepository = lampRepository;
    }

    @GetMapping("/lamps")
    public List<Lamp> getAllLamps() {
        return lampRepository.findAll();
    }
}
