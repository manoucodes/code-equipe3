package ca.etsmtl.taf.performance.gatling.model;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GatlingWsTestRequest {
    @JsonAlias("testBaseUrl")
    private String baseUrl;
    @JsonAlias("testCriteria")
    private String criteria;
    @JsonAlias("testUsersNumber")
    private String usersNumber;
    @JsonAlias("threshold")
    private String threshold;
}