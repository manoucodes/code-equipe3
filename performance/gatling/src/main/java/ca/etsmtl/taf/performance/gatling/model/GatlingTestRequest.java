package ca.etsmtl.taf.performance.gatling.model;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GatlingTestRequest {
    @JsonAlias("testBaseUrl")
    private String baseUrl;
    @JsonAlias("testScenarioName")
    private String scenarioName;
    @JsonAlias("testRequestName")
    private String requestName;
    @JsonAlias("testUri")
    private String uri;
    @JsonAlias("testRequestBody")
    private String requestBody;
    @JsonAlias("testMethodType")
    private String methodType;
    @JsonAlias("testUsersNumber")
    private int usersNumber;
    @JsonAlias("assertionMeanResponseTime")
    private int meanResponseTime;
    @JsonAlias("assertionFailedRequestsPercent")
    private double failedRequestsPercent;

}