package com.mgmtp.a12.tutorial.workflow.engine;

import org.cibseven.bpm.engine.ProcessEngine;
import org.cibseven.bpm.engine.runtime.ProcessInstanceWithVariables;
import org.cibseven.bpm.engine.test.Deployment;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.entry;

@Deployment(resources = "bpmn/CustomerOnboardingProcess.bpmn")
public class CustomerOnboardingProcessScriptTaskTest extends AbstractProcessEngineTest {

    private static ProcessInstanceWithVariables executeAssignSalesRepScriptTask(ProcessEngine processEngine, String customerType) {
        return processEngine.getRuntimeService()
                .createProcessInstanceByKey("CustomerOnboardingProcess")
                .startBeforeActivity("assignSalesRepActivity")
                .setVariableLocal("customerType", customerType)
                .executeWithVariablesInReturn();
    }

    @Test
    void givenVip_shouldAssignVipSalesRep(ProcessEngine processEngine) {
        // given
        String customerType = "vip";

        // when
        var processInstance = executeAssignSalesRepScriptTask(processEngine, customerType);

        // then
        assertThat(processInstance.getVariables()).contains(entry("salesRep", "vip@acme.org"));
    }

    @ParameterizedTest
    @ValueSource(strings = { "partner", "lead" })
    void givenNonVip_shouldAssignRegularSalesRep(String customerType, ProcessEngine processEngine) {
        // when
        var processInstance = executeAssignSalesRepScriptTask(processEngine, customerType);

        // then
        assertThat(processInstance.getVariables()).contains(entry("salesRep", "sales@acme.org"));
    }

    @ParameterizedTest
    @ValueSource(strings = { "inactive", "suspended" })
    void givenInactiveOrSuspended_shouldAssignNoSalesRep(String customerType, ProcessEngine processEngine) {
        // when
        var processInstance = executeAssignSalesRepScriptTask(processEngine, customerType);

        // then
        assertThat(processInstance.getVariables()).contains(entry("salesRep", null));
    }
}