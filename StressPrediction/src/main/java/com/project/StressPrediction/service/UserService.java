package com.project.StressPrediction.service;

import com.project.StressPrediction.model.User;
import com.project.StressPrediction.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(String username, String email, String password, int age) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already in use");
        }
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(password); // In production, encrypt this!
        user.setAge(age);
        return userRepository.save(user);
    }

    public User loginUser(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPassword().equals(password)) {
                return user;
            }
        }
        return null;
    }
    
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }
}
