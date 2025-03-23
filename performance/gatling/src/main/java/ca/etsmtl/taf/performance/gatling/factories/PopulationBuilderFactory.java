package ca.etsmtl.taf.performance.gatling.factories;

import io.gatling.javaapi.core.ScenarioBuilder;
import io.gatling.javaapi.core.PopulationBuilder;
import ca.etsmtl.taf.performance.gatling.model.GatlingTestRequest;
import java.time.Duration;
import io.gatling.javaapi.core.Assertion;
import static io.gatling.javaapi.core.CoreDsl.*;
import ca.etsmtl.taf.performance.gatling.factories.ProtocolBuilderFactory;
import java.util.ArrayList;
import java.util.List;
import ca.etsmtl.taf.performance.gatling.model.GatlingTestRequestPercentileResponseTime;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.File;
import java.io.IOException;


public class PopulationBuilderFactory {
    public static PopulationBuilder createDefaultSimulationPopulationBuilder(ScenarioBuilder scn, GatlingTestRequest gatlingTestRequest) {
        /* try {
            ObjectMapper objectMapper = new ObjectMapper();

            //String jsonString = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(gatlingTestRequest);

            File logFile = new File("gatling_output.log");
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(logFile, gatlingTestRequest);
        } catch (IOException e) {
            e.printStackTrace();
        } */
        switch (gatlingTestRequest.getProtocol()) {
            case "HTTP":
                return scn.injectOpen(rampUsers(gatlingTestRequest.getUsersNumber()).during(Duration.ofSeconds(gatlingTestRequest.getRampUpDuration())));
            case "WebSocket":
                return scn.injectOpen(rampUsers(gatlingTestRequest.getUsersNumber()).during(Duration.ofSeconds(gatlingTestRequest.getRampUpDuration())));
            default:
                throw new IllegalArgumentException("Invalid protocol: " + gatlingTestRequest.getProtocol());
        }
    }

    public static PopulationBuilder createSmokeTestSimulationPopulationBuilder(ScenarioBuilder scn, GatlingTestRequest gatlingTestRequest) {
        switch (gatlingTestRequest.getProtocol()) {
            case "HTTP":
                return scn.injectOpen(atOnceUsers(gatlingTestRequest.getUsersAtOnce()));
            case "WebSocket":
                return scn.injectOpen(atOnceUsers(gatlingTestRequest.getUsersAtOnce()));
            default:
                throw new IllegalArgumentException("Invalid protocol: " + gatlingTestRequest.getProtocol());
        }
    }  

    public static PopulationBuilder createSpikeTestSimulationPopulationBuilder(ScenarioBuilder scn, GatlingTestRequest gatlingTestRequest) {
        switch (gatlingTestRequest.getProtocol()) {
            case "HTTP":
                return scn.injectOpen(
                        constantUsersPerSec(gatlingTestRequest.getConstantUsers()).during(Duration.ofSeconds(gatlingTestRequest.getConstantUsersDuration())),
                        atOnceUsers(gatlingTestRequest.getUsersAtOnce()),
                        constantUsersPerSec(gatlingTestRequest.getUsersAtOnce()).during(Duration.ofMinutes(3)),
                        constantUsersPerSec(gatlingTestRequest.getConstantUsers()).during(Duration.ofSeconds(gatlingTestRequest.getConstantUsersDuration()))
                );
            case "WebSocket":
                return scn.injectOpen(
                        constantUsersPerSec(gatlingTestRequest.getConstantUsers()).during(Duration.ofSeconds(gatlingTestRequest.getConstantUsersDuration())),
                        atOnceUsers(gatlingTestRequest.getUsersAtOnce()),
                        constantUsersPerSec(gatlingTestRequest.getUsersAtOnce()).during(Duration.ofMinutes(3)),
                        constantUsersPerSec(gatlingTestRequest.getConstantUsers()).during(Duration.ofSeconds(gatlingTestRequest.getConstantUsersDuration()))
                );
            default:
                throw new IllegalArgumentException("Invalid protocol: " + gatlingTestRequest.getProtocol());
        }
    }
    public static PopulationBuilder createLoadTestSimulationPopulationBuilder(ScenarioBuilder scn, GatlingTestRequest gatlingTestRequest) {
        switch (gatlingTestRequest.getProtocol()) {
            case "HTTP":
                return scn.injectOpen(rampUsers(gatlingTestRequest.getUsersNumber()).during(Duration.ofSeconds(gatlingTestRequest.getRampUpDuration())));
            case "WebSocket":
                return scn.injectOpen(rampUsers(gatlingTestRequest.getUsersNumber()).during(Duration.ofSeconds(gatlingTestRequest.getRampUpDuration())));
            default:
                throw new IllegalArgumentException("Invalid protocol: " + gatlingTestRequest.getProtocol());
        }
    }    
    public static PopulationBuilder createStressTestSimulationPopulationBuilder(ScenarioBuilder scn, GatlingTestRequest gatlingTestRequest) {
        switch (gatlingTestRequest.getProtocol()) {
            case "HTTP":
                return scn.injectOpen(rampUsersPerSec(gatlingTestRequest.getUserRampUpPerSecondMin()).to(gatlingTestRequest.getUserRampUpPerSecondMax()).during(Duration.ofSeconds(gatlingTestRequest.getUserRampUpPerSecondDuration())));
            case "WebSocket":
                return scn.injectOpen(rampUsersPerSec(gatlingTestRequest.getUserRampUpPerSecondMin()).to(gatlingTestRequest.getUserRampUpPerSecondMax()).during(Duration.ofSeconds(gatlingTestRequest.getUserRampUpPerSecondDuration())));
            default:
                throw new IllegalArgumentException("Invalid protocol: " + gatlingTestRequest.getProtocol());
        }
    }
}