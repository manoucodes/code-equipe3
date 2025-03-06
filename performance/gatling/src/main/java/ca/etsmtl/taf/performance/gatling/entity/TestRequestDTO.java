package ca.etsmtl.taf.performance.gatling.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestRequestDTO {

    private String baseUrl;
    private String scenarioName;
    private String requestName;
    private String uri;
    private String requestBody;
    private String methodType;
    private int usersNumber;
}
