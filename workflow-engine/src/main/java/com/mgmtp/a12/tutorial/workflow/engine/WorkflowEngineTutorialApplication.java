package com.mgmtp.a12.tutorial.workflow.engine;

import com.mgmtp.a12.workflows.engine.ProcessEngineApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
class WorkflowEngineTutorialApplication extends ProcessEngineApplication {
    public static void main(String[] args) {
        SpringApplication.run(WorkflowEngineTutorialApplication.class, args);
    }
}