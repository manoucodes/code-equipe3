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
    @JsonAlias("simulationStrategy")
    private String simulationStrategy;
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
    @JsonAlias("testRampUpDuration")
    private int rampUpDuration;
    @JsonAlias("testUsersAtOnce")
    private int usersAtOnce;
    @JsonAlias("testUserRampUpPerSecondMin")
    private int userRampUpPerSecondMin;
    @JsonAlias("testUserRampUpPerSecondMax")
    private int userRampUpPerSecondMax;
    @JsonAlias("testUserRampUpPerSecondDuration")
    private int userRampUpPerSecondDuration;
    @JsonAlias("testConstantUsers")
    private int constantUsers;
    @JsonAlias("testConstantUsersDuration")
    private int constantUsersDuration;
    @JsonAlias("testNothingFor")
    private int nothingFor;
    @JsonAlias("assertionMeanResponseTime")
    private int meanResponseTime;
    @JsonAlias("assertionFailedRequestsPercent")
    private double failedRequestsPercent;

}