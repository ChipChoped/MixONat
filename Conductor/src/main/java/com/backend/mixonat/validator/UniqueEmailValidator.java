package com.backend.mixonat.validator;

import com.backend.mixonat.model.User;
import com.backend.mixonat.repository.UserRepository;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Optional;

public class UniqueEmailValidator implements ConstraintValidator<UniqueEmail, Object> {
    @Autowired
    UserRepository userRepository;

    @Override
    public boolean isValid(Object email, ConstraintValidatorContext constraintValidatorContext) {
        boolean isValidUser = false;

        if(email != null && !((String) email).isEmpty()) {
            Optional<User> user = userRepository.findUserByEmail((String) email);
            isValidUser = user.isEmpty();
        }

        return isValidUser;
    }
}
