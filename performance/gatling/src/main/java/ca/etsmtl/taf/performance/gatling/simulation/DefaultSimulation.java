package ca.etsmtl.taf.performance.gatling.simulation;

import ca.etsmtl.taf.performance.gatling.factories.PopulationBuilderFactory;
import ca.etsmtl.taf.performance.gatling.model.GatlingTestRequest;
import ca.etsmtl.taf.performance.gatling.model.GatlingTestRequestPercentileResponseTime;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.gatling.javaapi.core.Assertion;
import io.gatling.javaapi.core.ChainBuilder;
import io.gatling.javaapi.core.ScenarioBuilder;
import io.gatling.javaapi.core.Simulation;
import io.gatling.javaapi.http.HttpProtocolBuilder;
import io.gatling.javaapi.http.HttpRequestActionBuilder;
import ca.etsmtl.taf.performance.gatling.factories.ProtocolRequestFactory;
import ca.etsmtl.taf.performance.gatling.factories.ProtocolBuilderFactory;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.http;
import static io.gatling.javaapi.http.HttpDsl.status;

public class DefaultSimulation extends Simulation {

    private String requestJson = System.getProperty("requestJson");


    private GatlingTestRequest gatlingTestRequest = parseRequestDetails(requestJson);


    private GatlingTestRequest parseRequestDetails(String requestJson) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.readValue(requestJson, GatlingTestRequest.class);
        } catch (Exception e) {
            return null;
        }
    }



    private ScenarioBuilder scn = scenario(gatlingTestRequest.getScenarioName())
            .exec(ProtocolRequestFactory.createRequest(gatlingTestRequest));

    {
        List<Assertion> assertions = new ArrayList<>();

                if (gatlingTestRequest.getMeanResponseTime() >= 0) {
                    assertions.add(global().responseTime().mean().lt(gatlingTestRequest.getMeanResponseTime()));
                }

                if (gatlingTestRequest.getFailedRequestsPercent() >= 0) {
                    assertions.add(global().failedRequests().percent().lt(gatlingTestRequest.getFailedRequestsPercent()));
                }

                if (gatlingTestRequest.getResponseTimePerPercentile().size() > 0) {
                    for(GatlingTestRequestPercentileResponseTime assertion : gatlingTestRequest.getResponseTimePerPercentile()){
                        assertions.add(global().responseTime().percentile(assertion.getPercentile()).lt(assertion.getResponseTime()));
                    }
                }
        setUp(PopulationBuilderFactory.createDefaultSimulationPopulationBuilder(scn, gatlingTestRequest)).protocols(ProtocolBuilderFactory.createHttpProtocolBuilder(gatlingTestRequest)).assertions(assertions.toArray(new Assertion[0]));
    }
}
