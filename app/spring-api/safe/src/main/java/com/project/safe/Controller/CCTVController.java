package com.project.safe.controller;

import com.project.safe.domain.CCTV;
import com.project.safe.repository.CCTVRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CCTVController {

    @Autowired
    private CCTVRepository cctvRepository;

    @GetMapping("/cctv")
    public List<CCTV> getAllCctvs() {
        return cctvRepository.findAll();
    }
}
