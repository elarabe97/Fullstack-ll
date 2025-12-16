package com.levelupgamer.backend.controller;

import com.levelupgamer.backend.entity.Review;
import com.levelupgamer.backend.entity.User;
import com.levelupgamer.backend.repository.ReviewRepository;
import com.levelupgamer.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    @GetMapping
    public List<Review> getReviews(@RequestParam(required = false) String productCode) {
        if (productCode != null) {
            return reviewRepository.findByProductCode(productCode);
        }
        return reviewRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody Review review, Authentication auth) {
        // Seguridad ya exige auth para POST, pero esto evita 500 si llega sin token por
        // error
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = auth.getName();
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        review.setUserName(user.getFullName());
        return ResponseEntity.ok(reviewRepository.save(review));
    }
}
