package com.project.safe.Controller;

import com.project.safe.domain.CCTV;
import com.project.safe.repository.CCTVRepository;
// import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CCTVController {

    private final CCTVRepository cctvRepository;

    public CCTVController(CCTVRepository cctvRepository) {
        this.cctvRepository = cctvRepository;
    }

    @GetMapping("/cctvs")
    public List<CCTV> getAllCctvs() {
        return cctvRepository.findAll();
    }
}