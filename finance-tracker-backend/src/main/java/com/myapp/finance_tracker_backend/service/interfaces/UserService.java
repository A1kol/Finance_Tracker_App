package com.myapp.finance_tracker_backend.service.interfaces;

import com.myapp.finance_tracker_backend.model.User;

public interface UserService {
    User registerUser(User user);
    User loginUser(String name, String password);
}
