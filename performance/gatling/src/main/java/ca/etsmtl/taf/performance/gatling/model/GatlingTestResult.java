package ca.etsmtl.taf.performance.gatling.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GatlingTestResult {
    private String simulation;
    private String simulationId;
    private long start;
    private String description;
    private List<String> scenarios;
    private List<GatlingAssertionResults> assertions;
}