package com.application.webapplication.Repository;

import com.application.webapplication.Entity.PromptConfigEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PromptConfigRepo extends JpaRepository<PromptConfigEntity, Long> {
    Optional<PromptConfigEntity> findByPromptKey(String promptKey);
}
