package com.example.User.Service.repositories;

import com.example.User.Service.entities.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserAccountRepo extends JpaRepository<UserAccount , UUID> {
    Optional<UserAccount> findByUserName(String username);

}
