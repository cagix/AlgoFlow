package com.algoflow.backend;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/problems")
public class ProblemController {

    private final ProblemService problemService;

    public ProblemController(ProblemService problemService) {
        this.problemService = problemService;
    }

    @GetMapping
    public List<Map<String, Object>> listProblems() {
        return problemService.getAllProblems().stream().map(p -> {
            Map<String, Object> map = new java.util.LinkedHashMap<>();
            map.put("id", p.id());
            map.put("title", p.title());
            map.put("difficulty", p.difficulty());
            map.put("category", p.category());
            map.put("description", p.description());
            map.put("examples", p.examples());
            map.put("leetcodeUrl", p.leetcodeUrl());
            map.put("starterCode", p.starterCode());
            map.put("starterCodePython", p.starterCodePython());
            return map;
        }).toList();
    }
}
