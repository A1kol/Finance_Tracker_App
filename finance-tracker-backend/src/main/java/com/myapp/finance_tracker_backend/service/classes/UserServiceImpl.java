package com.myapp.finance_tracker_backend.service.classes;


import com.myapp.finance_tracker_backend.model.User;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.myapp.finance_tracker_backend.repository.UserRepository;
import com.myapp.finance_tracker_backend.service.interfaces.UserService;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService, UserDetailsService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Cacheable("users")
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = findUserByName(username);
        if (user == null) {
            throw new UsernameNotFoundException("Пользователь с именем " + username + " не найден");
        }
        return user;
    }

    public User registerUser(User user) {
        if(repository.findUserByName(user.getName()).isEmpty()) {
            String hashedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(hashedPassword);
            repository.save(user);
            return user;
        } else {
            return null;
        }
    }

    public User loginUser(String name, String password) {
        Optional<User> optionalUser = repository.findUserByName(name);
        if(optionalUser.isPresent() && passwordEncoder.matches(password, optionalUser.get().getPassword())) {
            return optionalUser.get();
        } return null;
    }

    public User findUserByName(String name) {
        Optional<User> optionalUser = repository.findUserByName(name);
        return optionalUser.orElse(null);
    }
}
