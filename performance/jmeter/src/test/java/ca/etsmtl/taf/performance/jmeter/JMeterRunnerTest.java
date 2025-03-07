package ca.etsmtl.taf.performance.jmeter;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import ca.etsmtl.taf.performance.jmeter.config.JMeterConfigurator;
import ca.etsmtl.taf.performance.jmeter.model.HttpTestPlan;
import ca.etsmtl.taf.performance.jmeter.model.JMeterResponse;
import ca.etsmtl.taf.performance.jmeter.model.TestPlanBase;
import ca.etsmtl.taf.performance.jmeter.utils.JMeterRunner;

import static org.junit.jupiter.api.Assertions.*;

public class JMeterRunnerTest {
    @BeforeAll
    static void setUp() {
        // Need to initialize the JMeter and copy the JMX files to the temp folder
        JMeterConfigurator jMeterConfigurator = new JMeterConfigurator();
        jMeterConfigurator.onApplicationEvent(null);
    }

    @Test
    void testExecuteHttpTestPlan() {

        // "nbThreads": "3",
        // "rampTime": "5",
        // "duration": "",
        // "domain": "httpbin.org",
        // "port": "",
        // "protocol": "https",
        // "path": "/get",
        // "method": "GET",
        // "loop": "2"

        HttpTestPlan testPlan = HttpTestPlan.builder()
                .nbThreads("3")
                .rampTime("5")
                .protocol("https")
                .domain("httpbin.org")
                .method("GET")
                .path("/get")
                .loop("2")
                .duration("")
                .port("")
                .data("")
                .build();

        try {
            JMeterResponse response = JMeterRunner.executeTestPlanAndGenerateReport(testPlan);

            assertTrue(response.getDetails().getContentType().equalsIgnoreCase("html"), "Content type should be 'html'");
            assertNotNull(response.getSummary(), "Summary should not be empty");
            assertFalse(response.getDetails().getLocationURL().isEmpty(), "Location URL should not be empty");

        } catch (JMeterRunnerException e) {
            fail();
        }
    }
}
