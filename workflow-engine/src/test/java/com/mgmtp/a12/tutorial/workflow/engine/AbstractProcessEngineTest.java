package com.mgmtp.a12.tutorial.workflow.engine;

import org.cibseven.bpm.engine.ProcessEngine;
import org.cibseven.bpm.engine.ProcessEngineConfiguration;
import org.cibseven.bpm.engine.test.junit5.ProcessEngineExtension;
import org.junit.jupiter.api.extension.RegisterExtension;

public class AbstractProcessEngineTest {

    private final ProcessEngine inMemProcessEngine = ProcessEngineConfiguration
            .createStandaloneInMemProcessEngineConfiguration()
            .setJdbcUrl("jdbc:h2:mem:cibseven;DB_CLOSE_DELAY=-1")
            .setDatabaseSchemaUpdate(ProcessEngineConfiguration.DB_SCHEMA_UPDATE_TRUE) // prevent re-create
            .buildProcessEngine();

    @RegisterExtension
    ProcessEngineExtension extension = ProcessEngineExtension.builder()
            .useProcessEngine(inMemProcessEngine)
            .build();
}