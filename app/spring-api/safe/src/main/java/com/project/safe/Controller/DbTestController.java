<<<<<<< HEAD
package com.project.safe.controller;
=======
// package com.project.safe.Controller;
>>>>>>> f3bde4a4138327d27ff557eab8ec930c4c8fbd52

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.jdbc.core.JdbcTemplate;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// @RestController
// @RequestMapping("/api")
// public class DbTestController {

// private final JdbcTemplate jdbcTemplate;

// @Autowired
// public DbTestController(JdbcTemplate jdbcTemplate) {
// this.jdbcTemplate = jdbcTemplate;
// }

// @GetMapping("/test-db")
// public String testDBConnection() {
// try {
// String result = jdbcTemplate.queryForObject("SELECT 'DB 연결 OK' FROM dual",
// String.class);
// return "✅ DB 연결 성공: " + result;
// } catch (Exception e) {
// return "❌ DB 연결 실패: " + e.getMessage();
// }
// }
// }