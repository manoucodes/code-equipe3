package ca.etsmtl.taf.performance.gatling.simulation;

import static io.gatling.javaapi.core.CoreDsl.StringBody;
import static io.gatling.javaapi.core.CoreDsl.exec;
import static io.gatling.javaapi.core.CoreDsl.global;
import static io.gatling.javaapi.core.CoreDsl.rampUsers;
import static io.gatling.javaapi.core.CoreDsl.scenario;
import static io.gatling.javaapi.http.HttpDsl.http;
import static io.gatling.javaapi.http.HttpDsl.status;


import ca.etsmtl.taf.performance.gatling.factories.ProtocolRequestFactory;
import ca.etsmtl.taf.performance.gatling.factories.ProtocolBuilderFactory;
import ca.etsmtl.taf.performance.gatling.factories.PopulationBuilderFactory;

import ca.etsmtl.taf.performance.gatling.model.GatlingTestRequestPercentileResponseTime;
import com.fasterxml.jackson.databind.ObjectMapper;

import ca.etsmtl.taf.performance.gatling.model.GatlingTestRequest;
import io.gatling.javaapi.core.Assertion;
import io.gatling.javaapi.core.ChainBuilder;
import io.gatling.javaapi.core.ScenarioBuilder;
import io.gatling.javaapi.core.Simulation;
import io.gatling.javaapi.http.HttpProtocolBuilder;
import io.gatling.javaapi.http.HttpRequestActionBuilder;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

public class LoadTestSimulation extends Simulation {

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
    private HttpProtocolBuilder httpProtocol = http.baseUrl(gatlingTestRequest.getBaseUrl())
            .acceptHeader("application/json")
            .contentTypeHeader("application/json");

    private ChainBuilder createHttpRequest() {
        String methodType = gatlingTestRequest.getMethodType();
        HttpRequestActionBuilder httpRequestBuilder;

        switch (methodType.toUpperCase()) {
            case "GET":
                httpRequestBuilder =http(gatlingTestRequest.getRequestName())
                        .get(gatlingTestRequest.getUri());
                break;
            case "POST":
                httpRequestBuilder = http(gatlingTestRequest.getRequestName())
                        .post(gatlingTestRequest.getUri())
                        .body(StringBody(gatlingTestRequest.getRequestBody()));
                break;
            case "PUT":
                httpRequestBuilder = http(gatlingTestRequest.getRequestName())
                        .put(gatlingTestRequest.getUri())
                        .body(StringBody(gatlingTestRequest.getRequestBody()));
                break;
            case "DELETE":
                httpRequestBuilder = http(gatlingTestRequest.getRequestName())
                        .delete(gatlingTestRequest.getUri());
                break;
            default:
                throw new IllegalArgumentException("Invalid HttpRequestMethod: " + methodType.toUpperCase());
        }

        return exec(httpRequestBuilder
                .check(status().not(404), status().not(500)));
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

        setUp(
                PopulationBuilderFactory.createLoadTestSimulationPopulationBuilder(scn, gatlingTestRequest)
        ).protocols(ProtocolBuilderFactory.createHttpProtocolBuilder(gatlingTestRequest))
                .assertions(assertions.toArray(new Assertion[0]));
    }
}
