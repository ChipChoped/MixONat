package com.backend.mixonat;

import static org.assertj.core.api.Assertions.assertThat;

import com.backend.mixonat.controller.RMNMotorController;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class SmokeTest {

	@Autowired
	private RMNMotorController controller;

	@Test
	void contextLoads() {
		assertThat(controller).isNotNull();
	}
}